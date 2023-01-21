import { Theme } from '@mui/material/styles';

import Input from './Input';
import Button from './Button';
import Table from './Table';

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(Input(theme), Button(theme), Table(theme));
}
