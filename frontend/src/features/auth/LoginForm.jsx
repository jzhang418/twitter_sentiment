import { Formik, Form } from "formik";
import { Button, Divider, Label } from "semantic-ui-react";
import * as Yup from "yup";
import ModalWrapper from "../../app/common/modals/ModalWrapper";
import MyTextInput from "../../app/common/form/MySelectInput";
import { useDispatch } from "react-redux";
import { closeModal } from "../../app/common/modals/modalSlice";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import { signInUser } from "./authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <ModalWrapper size='mini' header='Sign in'>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          password: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          dispatch(signInUser(values))
            .then(unwrapResult)
            .then(() => {
              dispatch(closeModal());
              navigate("/accounts");
            })
            .catch(error => {
              setErrors({auth: 'username or password is invalid'});
            })
            .finally(() => {
              setSubmitting(false);
            })
        }}
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form className='ui form'>
            <MyTextInput name='username' placeholder='Username' />
            <MyTextInput
              name='password'
              placeholder='Password'
              type='password'
            />
            {errors.auth && <Label basic color="red" style={{marginBottom: 10}} content={errors.auth} />}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              fluid
              size='large'
              color='teal'
              content='Login'
            />
            <Divider horizontal>Or</Divider>
            <SocialLogin />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}

export default LoginForm;
