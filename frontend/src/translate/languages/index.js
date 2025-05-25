import { messages as germanMessages } from './de';
import { messages as englishMessages } from './en';
import { messages as spanishMessages } from './es';
import { messages as frenchMessages } from './fr';
import { messages as indonesianMessages } from './id';
import { messages as italianMessages } from './it';
import { messages as portugueseMessages } from './pt';
import { messages as portuguesePortugalMessages } from './pt_PT';

const messages = {
  ...englishMessages,
  ...frenchMessages,
  ...germanMessages,
  ...indonesianMessages,
  ...italianMessages,
  ...portugueseMessages,
  ...portuguesePortugalMessages,
  ...spanishMessages,
};

export { messages };
