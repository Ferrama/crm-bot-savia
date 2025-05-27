import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso' },
];

const CurrencySelect = ({ value, onChange, label = 'Currency' }) => {
  return (
    <FormControl fullWidth variant='outlined' size='small'>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label}>
        {currencies.map((currency) => (
          <MenuItem key={currency.code} value={currency.code}>
            {currency.code} - {currency.name} ({currency.symbol})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const formatCurrency = (value, currencyCode) => {
  const currency =
    currencies.find((c) => c.code === currencyCode) || currencies[0];

  return value?.toLocaleString('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const getCurrencySymbol = (currencyCode) => {
  const currency =
    currencies.find((c) => c.code === currencyCode) || currencies[0];
  return currency.symbol;
};

export default CurrencySelect;
