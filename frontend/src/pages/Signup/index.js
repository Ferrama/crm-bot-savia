import qs from 'query-string';
import React, { useEffect, useRef, useState } from 'react';

import { InputLabel, MenuItem, Select, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import usePlans from '../../hooks/usePlans';
import { i18n } from '../../translate/i18n';

import toastError from '../../errors/toastError';
import { openApi } from '../../services/api';

import ReCAPTCHA from 'react-google-recaptcha';
import useSettings from '../../hooks/useSettings';
import config from '../../services/config';

const Copyright = () => {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='#'>
        PLW
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  logoImg: {
    width: '100%',
    margin: '0 auto',
    content: `url("${theme.calculatedLogo()}")`,
  },
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string().min(5, 'Too Short!').max(50, 'Too Long!'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const SignUp = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { getPublicSetting } = useSettings();
  const [allowSignup, setAllowSignup] = useState(false);

  let companyId = null;

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = {
    name: '',
    email: '',
    phone: '',
    password: '',
    planId: '',
  };

  const [user] = useState(initialState);

  const handleSignUp = async (values) => {
    if (config.RECAPTCHA_SITE_KEY) {
      Object.assign(values, {
        captchaToken: await captchaRef.current.executeAsync(),
      });
    }

    Object.assign(values, { recurrence: 'MENSAL' });
    Object.assign(values, { status: 't' });
    Object.assign(values, { campaignsEnabled: true });
    try {
      await openApi.post('/companies/cadastro', values);
      toast.success(i18n.t('signup.toasts.success'));
      history.push('/login');
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  };

  const [plans, setPlans] = useState([]);
  const { listPublic: listPublicPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPublicPlans();
      setPlans(list);
    }
    fetchData();
  }, []);

  const captchaRef = useRef(null);

  getPublicSetting('allowSignup').then((data) => {
    setAllowSignup(data === 'enabled');
  });

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <img className={classes.logoImg} />
        </div>
        {/*<Typography component="h1" variant="h5">
					{i18n.t("signup.title")}
				</Typography>*/}
        {/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
        <Formik
          initialValues={user}
          enableReinitialize={true}
          validationSchema={UserSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSignUp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className={classes.form}>
              {allowSignup && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        autoComplete='name'
                        name='name'
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        variant='outlined'
                        fullWidth
                        id='name'
                        label='Nome da Empresa'
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        variant='outlined'
                        fullWidth
                        id='email'
                        label={i18n.t('signup.form.email')}
                        name='email'
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        autoComplete='email'
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        variant='outlined'
                        fullWidth
                        id='phone'
                        label='Telefone com (DDD)'
                        name='phone'
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        autoComplete='phone'
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        variant='outlined'
                        fullWidth
                        name='password'
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        label={i18n.t('signup.form.password')}
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel htmlFor='plan-selection'>Plano</InputLabel>
                      <Field
                        as={Select}
                        variant='outlined'
                        fullWidth
                        id='plan-selection'
                        label='Plano'
                        name='planId'
                        required
                      >
                        {plans.map((plan, key) => (
                          <MenuItem key={key} value={plan.id}>
                            {plan.name} - Atendentes: {plan.users} - WhatsApp:{' '}
                            {plan.connections} - Filas: {plan.queues} - R${' '}
                            {plan.value}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  </Grid>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                  >
                    {i18n.t('signup.buttons.submit')}
                  </Button>
                </>
              )}
              {allowSignup || <h2>Cadastro desabilitado!</h2>}
              <Grid container justify='flex-end'>
                <Grid item>
                  <Link
                    href='#'
                    variant='body2'
                    component={RouterLink}
                    to='/login'
                  >
                    {i18n.t('signup.buttons.login')}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}>{/* <Copyright /> */}</Box>
      {config.RECAPTCHA_SITE_KEY && allowSignup && (
        <ReCAPTCHA
          size='invisible'
          sitekey={config.RECAPTCHA_SITE_KEY}
          ref={captchaRef}
        />
      )}
    </Container>
  );
};

export default SignUp;
