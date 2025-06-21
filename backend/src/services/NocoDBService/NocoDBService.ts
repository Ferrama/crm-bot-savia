import axios from "axios";
import { logger } from "../../utils/logger";

interface WhatsAppInstance {
  Id?: number;
  Owner: string;
  Token: string;
  InstanceName: string;
  MainConnection: boolean;
  clients_id: number;
  AssignedUserId: number | null;
}

export interface StarlingNocoDB {
  Id?: number;
  DbUrl: string;
  ApiKey: string;
  NextRequest: string;
  Company: string;
}

export interface Company {
  Id?: number;
  Company: string;
  Apikey?: string;
  MontlhyOpenApiRequestCounter?: number;
  MontlhyOpenApiRequestLimit?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  WSPIntegrations?: number;
  InstanceId?: string | null;
}

export class NocoDBService {
  private readonly logger = logger;

  private readonly nocodbClients: string;

  private readonly nocodbWspInstances: string;

  private readonly nocodbStarlings: string;

  private readonly baseUrl: string;

  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.NOCODB_API_KEY || "";
    this.baseUrl =
      process.env.NOCODB_BASE_URL || "https://nocodb.saviaweb.tech/api/v2";
    this.nocodbClients = process.env.NOCODB_CLIENTS || "";
    this.nocodbWspInstances = process.env.NOCODB_WSP_INSTANCES || "";
    this.nocodbStarlings = process.env.NOCODB_STARLINGS || "";

    this.logger.info("NocoDB Configuration:", {
      baseUrl: this.baseUrl,
      nocodbClients: this.nocodbClients,
      nocodbWspInstances: this.nocodbWspInstances,
      nocodbStarlings: this.nocodbStarlings,
      apiKeyLength: this.apiKey.length
    });
  }

  async findCompany(
    idCompany: string,
    fields?: string[],
    searchBy: "Id" | "Company" = "Company"
  ): Promise<Company> {
    try {
      const url = `${this.baseUrl}/tables/${this.nocodbClients}/records`;
      const params = {
        limit: 1000,
        offset: 0,
        where: `(${searchBy},eq,${idCompany})`,
        fields: fields ? fields.join(",") : undefined
      };
      const headers = {
        "xc-token": this.apiKey,
        accept: "application/json"
      };

      const response = await axios.get(url, {
        headers,
        params
      });

      const companies = response.data.list;

      if (!companies || companies.length === 0) {
        throw new Error(`Company with ${searchBy} ${idCompany} not found`);
      }

      return companies[0] as Company;
    } catch (error: any) {
      this.logger.error(
        `Error fetching company from NocoDB: ${error.message}`,
        {
          error: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          params: error.config?.params,
          headers: error.config?.headers
            ? { ...error.config.headers, "xc-token": "[REDACTED]" }
            : undefined
        }
      );
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
  }

  async findCompanyById(idCompany: number): Promise<Company> {
    try {
      const url = `${this.baseUrl}/tables/${this.nocodbClients}/records/${idCompany}`;

      const response = await axios.get(url, {
        headers: {
          "xc-token": this.apiKey,
          accept: "application/json"
        }
      });

      return response.data as Company;
    } catch (error: any) {
      this.logger.error(`[findCompanyById] Error: ${error.message}`, {
        error: error.response?.data,
        status: error.response?.status,
        companyId: idCompany,
        url: error.config?.url
      });
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
  }

  async createWhatsAppInstance(
    instanceData: WhatsAppInstance,
    companyId: number
  ): Promise<any> {
    try {
      // Creamos la instancia con el clients_id incluido
      const createResponse = await axios.post(
        `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
        {
          ...instanceData,
          clients_id: companyId
        },
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      return createResponse.data;
    } catch (error: any) {
      this.logger.error(`Error creating WhatsApp instance: ${error.message}`);
      throw new Error(`Failed to create WhatsApp instance: ${error.message}`);
    }
  }

  async linkWhatsAppInstanceToCompany(
    companyId: number,
    instanceId: number
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tables/${this.nocodbClients}/links/${this.nocodbWspInstances}/records/${companyId}`,
        [{ Id: instanceId }],
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Error linking WhatsApp instance to company: ${error.message}`
      );
      throw new Error(
        `Failed to link WhatsApp instance to company: ${error.message}`
      );
    }
  }

  async getCompanyWhatsAppInstances(
    companyId: number
  ): Promise<WhatsAppInstance[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json"
          },
          params: {
            where: `(clients_id,eq,${companyId})`
          }
        }
      );

      return response.data.list as WhatsAppInstance[];
    } catch (error: any) {
      this.logger.error(`Error fetching WhatsApp instances: ${error.message}`);
      throw new Error(`Failed to fetch WhatsApp instances: ${error.message}`);
    }
  }

  async deleteWhatsAppInstance(
    instanceName: string,
    companyId: number
  ): Promise<any> {
    try {
      // First, get the instance by name
      const instances = await this.getCompanyWhatsAppInstances(companyId);
      const instanceToDelete = instances.find(
        inst => inst.InstanceName === instanceName
      );

      if (!instanceToDelete) {
        throw new Error(
          `Instance ${instanceName} not found for company ${companyId}`
        );
      }

      // Then delete the instance using the correct NocoDB format
      const response = await axios.delete(
        `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json",
            "Content-Type": "application/json"
          },
          data: {
            Id: instanceToDelete.Id
          }
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(`Error deleting WhatsApp instance: ${error.message}`);
      throw new Error(`Failed to delete WhatsApp instance: ${error.message}`);
    }
  }

  async setMainConnection(
    instanceName: string,
    companyId: number
  ): Promise<any> {
    try {
      // First, get the instance record to get its ID
      const instances = await this.getCompanyWhatsAppInstances(companyId);
      const instance = instances.find(
        inst => inst.InstanceName === instanceName
      );

      if (!instance) {
        throw new Error(
          `Instance ${instanceName} not found for company ${companyId}`
        );
      }

      // First, set all instances to MainConnection: false
      await Promise.all(
        instances.map(inst =>
          axios.patch(
            `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
            {
              Id: inst.Id,
              MainConnection: false
            },
            {
              headers: {
                "xc-token": this.apiKey,
                "Content-Type": "application/json",
                accept: "application/json"
              }
            }
          )
        )
      );

      // Then set the target instance to MainConnection: true
      const response = await axios.patch(
        `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
        {
          Id: instance.Id,
          MainConnection: true
        },
        {
          headers: {
            "xc-token": this.apiKey,
            "Content-Type": "application/json",
            accept: "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Error setting main connection: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async updateWhatsAppInstance(
    instanceName: string,
    companyId: number,
    updateData: { isMain?: boolean; assignedUserId?: number }
  ): Promise<any> {
    try {
      // Get the instance record to get its ID
      const instances = await this.getCompanyWhatsAppInstances(companyId);
      const instance = instances.find(
        inst => inst.InstanceName === instanceName
      );

      if (!instance) {
        throw new Error(
          `Instance ${instanceName} not found for company ${companyId}`
        );
      }

      // If setting as main, handle that first
      if (updateData.isMain) {
        await this.setMainConnection(instanceName, companyId);
      }

      // Update the instance with the new data
      const response = await axios.patch(
        `${this.baseUrl}/tables/${this.nocodbWspInstances}/records`,
        {
          Id: instance.Id,
          AssignedUserId: updateData.assignedUserId
        },
        {
          headers: {
            "xc-token": this.apiKey,
            "Content-Type": "application/json",
            accept: "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Error updating WhatsApp instance: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findAllCompanies(): Promise<Company[]> {
    try {
      // First get all companies
      const response = await axios.get(
        `${this.baseUrl}/tables/${this.nocodbClients}/records`,
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json"
          },
          params: {
            limit: 1000
          }
        }
      );
      const companies = response.data.list as Company[];

      // For each company, get its WhatsApp instances
      const companiesWithInstances = await Promise.all(
        companies.map(async company => {
          try {
            const instances = await this.getCompanyWhatsAppInstances(
              company.Id!
            );
            const mainInstance = instances.find(inst => inst.MainConnection);
            return {
              ...company,
              InstanceId: mainInstance?.InstanceName || null
            };
          } catch (error: any) {
            this.logger.error(
              `Error fetching WhatsApp instances for company ${company.Company}: ${error.message}`
            );
            return {
              ...company,
              InstanceId: null
            };
          }
        })
      );

      return companiesWithInstances;
    } catch (error: any) {
      this.logger.error(
        `Error fetching companies from NocoDB: ${error.message}`
      );
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }
  }

  async findCompanyByApiKey(apiKey: string): Promise<Company> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tables/${this.nocodbClients}/records`,
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json"
          },
          params: {
            limit: 1,
            where: `(Apikey,eq,${apiKey})`
          }
        }
      );

      const companies = response.data.list;

      if (!companies || companies.length === 0) {
        throw new Error(`Company with API key ${apiKey} not found`);
      }

      return companies[0] as Company;
    } catch (error: any) {
      this.logger.error(`Error fetching company from NocoDB: ${error.message}`);
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
  }

  async incrementRequestCounter(companyId: number): Promise<number> {
    try {
      // Primero verificamos si la compañía existe
      let company: Company;
      try {
        company = await this.findCompanyById(companyId);
      } catch (error: any) {
        this.logger.error(
          `[incrementRequestCounter] Company not found: ${error.message}`
        );
        throw new Error(`Company with ID ${companyId} not found`);
      }

      const currentCounter = company.MontlhyOpenApiRequestCounter ?? 0;
      const limit = company.MontlhyOpenApiRequestLimit;

      if (limit !== null && currentCounter >= limit) {
        this.logger.warn(
          `[incrementRequestCounter] Limit reached for company ${companyId}: ${currentCounter}/${limit}`
        );
        throw new Error("Monthly API request limit reached");
      }

      const newCounter = currentCounter + 1;

      // Usamos el endpoint PATCH correcto
      const url = `${this.baseUrl}/tables/${this.nocodbClients}/records`;
      const updateData = {
        Id: companyId,
        MontlhyOpenApiRequestCounter: newCounter
      };

      await axios.patch(url, updateData, {
        headers: {
          "xc-token": this.apiKey,
          "Content-Type": "application/json",
          accept: "application/json"
        }
      });

      return newCounter;
    } catch (error: any) {
      this.logger.error(`[incrementRequestCounter] Error: ${error.message}`, {
        error: error.response?.data,
        status: error.response?.status,
        companyId,
        url: error.config?.url
      });
      throw error;
    }
  }

  async updateCompanyCounter(
    companyId: number,
    newCounter: number
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/tables/${this.nocodbClients}/records`;
      const updateData = {
        Id: companyId,
        MontlhyOpenApiRequestCounter: newCounter
      };

      await axios.patch(url, updateData, {
        headers: {
          "xc-token": this.apiKey,
          "Content-Type": "application/json",
          accept: "application/json"
        }
      });
    } catch (error: any) {
      this.logger.error(`[updateCompanyCounter] Error: ${error.message}`, {
        error: error.response?.data,
        status: error.response?.status,
        companyId,
        url: error.config?.url
      });
      throw error;
    }
  }

  async findAllStarlings(): Promise<StarlingNocoDB[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tables/${this.nocodbStarlings}/records`,
        {
          headers: {
            "xc-token": this.apiKey,
            accept: "application/json"
          },
          params: {
            limit: 1000,
            shuffle: 0,
            offset: 0
          }
        }
      );

      return response.data.list as StarlingNocoDB[];
    } catch (error: any) {
      this.logger.error(
        `Error fetching starlings from NocoDB: ${error.message}`
      );
      throw new Error(`Failed to fetch starlings: ${error.message}`);
    }
  }

  async updateStarlingNextRequest(
    starlingId: number,
    nextRequest: string
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/tables/${this.nocodbStarlings}/records`;
      const updateData = {
        Id: starlingId,
        NextRequest: nextRequest
      };

      await axios.patch(url, updateData, {
        headers: {
          "xc-token": this.apiKey,
          "Content-Type": "application/json",
          accept: "application/json"
        }
      });
    } catch (error: any) {
      this.logger.error(`[updateStarlingNextRequest] Error: ${error.message}`, {
        error: error.response?.data,
        status: error.response?.status,
        starlingId,
        url: error.config?.url
      });
      throw error;
    }
  }

  async createCompany(
    companyData: Omit<
      Company,
      "Id" | "CreatedAt" | "UpdatedAt" | "WSPIntegrations"
    >
  ): Promise<Company> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tables/${this.nocodbClients}/records`,
        {
          ...companyData,
          WSPIntegrations: 0 // Valor por defecto
        },
        {
          headers: {
            "xc-token": this.apiKey,
            "Content-Type": "application/json",
            accept: "application/json"
          }
        }
      );

      this.logger.info(`Company created successfully: ${companyData.Company}`);
      return response.data as Company;
    } catch (error: any) {
      this.logger.error(`Error creating company: ${error.message}`, {
        error: error.response?.data,
        status: error.response?.status,
        companyData: { ...companyData, Password: "[REDACTED]" }
      });
      throw new Error(`Failed to create company: ${error.message}`);
    }
  }
}
