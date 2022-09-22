import { Formik, Form } from "formik";
import { Button, Divider, Label } from "semantic-ui-react";
import * as Yup from "yup";
import ModalWrapper from "../../app/common/modals/ModalWrapper";
import MyTextInput from "../../app/common/form/MySelectInput";
import { useDispatch } from "react-redux";
import { closeModal } from "../../app/common/modals/modalSlice";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import { registerUser } from "./authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <ModalWrapper size='mini' header='Register'>
      <Formik
        initialValues={{ username: "", email: "", password: "", twitter_id: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          email: Yup.string().required().email(),
          password: Yup.string().required(),
          twitter_id: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          dispatch(registerUser(values))
          .then(unwrapResult)
          .then(() => {
            dispatch(closeModal());
            navigate("/accounts");
          })
          .catch(error => {
            setErrors({ auth: error.message });
          })
          .finally(() => {
            setSubmitting(false);
          })
        }}
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form className='ui form'>
            <MyTextInput name='username' placeholder='Username' />
            <MyTextInput name='email' placeholder='Email Address' />
            <MyTextInput
              name='password'
              placeholder='Password'
              type='password'
            />
            <MyTextInput name='twitter_id' placeholder='Twitter ID' />
            {errors.auth && (
              <Label
                basic
                color='red'
                style={{ marginBottom: 10 }}
                content={errors.auth}
              />
            )}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              fluid
              size='large'
              color='teal'
              content='Register'
            />
            <Divider horizontal>Or</Divider>
            <SocialLogin />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}

export default RegisterForm;
