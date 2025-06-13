import React, { useEffect, useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import useSettings from '../../hooks/useSettings';
import { i18n } from '../../translate/i18n.js';
import EfiSettings from '../PaymentGateways/Efi/EfiSettings';
import OwenAd from '../PaymentGateways/Owen/OwenAd';
import OwenSettings from '../PaymentGateways/Owen/OwenSettings';

const useStyles = makeStyles((_) => ({
  fieldContainer: {
    width: '100%',
    textAlign: 'left',
  },
}));

export default function PaymentGateway(props) {
  const { settings } = props;
  const classes = useStyles();
  const [paymentGateway, setPaymentGateway] = useState('');

  const { update } = useSettings();

  useEffect(() => {
    if (Array.isArray(settings) && settings.length) {
      const paymentGatewaySetting = settings.find(
        (s) => s.key === '_paymentGateway'
      );
      if (paymentGatewaySetting) {
        setPaymentGateway(paymentGatewaySetting.value);
      }
    }
  }, [settings]);

  async function handleChangePaymentGateway(value) {
    setPaymentGateway(value);
    await update({
      key: '_paymentGateway',
      value,
    });
    toast.success(i18n.t('settings.operationUpdated'));
  }

  return (
    <>
      <Grid spacing={3} container>
        <Grid xs={12} sm={6} md={4} item>
          <FormControl className={classes.fieldContainer}>
            <InputLabel id='paymentgateway-label'>
              {i18n.t('settings.paymentGateway')}
            </InputLabel>
            <Select
              labelId='paymentgateway-label'
              value={paymentGateway}
              onChange={async (e) => {
                handleChangePaymentGateway(e.target.value);
              }}
            >
              <MenuItem value={''}>{i18n.t('settings.none')}</MenuItem>
              <MenuItem value={'owen'}>
                {i18n.t('settings.owenPayments')}
              </MenuItem>
              <MenuItem value={'efi'}>{i18n.t('settings.efi')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {paymentGateway === 'efi' && <EfiSettings settings={settings} />}
      {paymentGateway === 'owen' && <OwenSettings settings={settings} />}
      {paymentGateway === '' && <OwenAd />}
    </>
  );
}
