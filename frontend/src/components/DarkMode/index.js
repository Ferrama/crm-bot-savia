import React, { useState } from 'react';

import { CssBaseline, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Moon, Sun } from 'lucide-react';

const useStyles = makeStyles((theme) => ({
  icons: {
    color: '#fff',
  },
  switch: {
    color: '#fff',
  },
  visible: {
    display: 'none',
  },
  btnHeader: {
    color: '#fff',
  },
}));

const DarkMode = (props) => {
  const classes = useStyles();

  const [theme, setTheme] = useState('light');

  const themeToggle = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const handleClick = () => {
    props.themeToggle();
    themeToggle();
  };

  return (
    <>
      {theme === 'light' ? (
        <>
          <CssBaseline />
          <IconButton
            className={classes.icons}
            onClick={handleClick}
            // ref={anchorEl}
            aria-label='Dark Mode'
            color='inherit'
          >
            <Moon />
          </IconButton>
        </>
      ) : (
        <>
          <CssBaseline />
          <IconButton
            className={classes.icons}
            onClick={handleClick}
            // ref={anchorEl}
            aria-label='Dark Mode'
            color='inherit'
          >
            <Sun />
          </IconButton>
        </>
      )}
    </>
  );
};

export default DarkMode;
