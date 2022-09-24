import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { Button, Label } from "semantic-ui-react";
import * as Yup from "yup";
import { unwrapResult } from "@reduxjs/toolkit";
import MyTextInput from "../../../app/common/form/MySelectInput";
import { updateUserProfile } from "../profileSlic";

function ProfileForm({profile}) {
    const dispatch = useDispatch();

  return (
    <Formik
        initialValues={{ username: profile.username, email: profile.email, password: "", twitter_id: profile.twitter_id }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          email: Yup.string().required().email(),
          password: Yup.string(),
          twitter_id: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            dispatch(updateUserProfile(values)).then(unwrapResult);
          } catch (error) {
            setErrors({ auth: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, errors }) => (
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
              disabled={!isValid || isSubmitting}
              type='submit'
              floated='right'
              size='large'
              positive
              content='Update'
            />
          </Form>
        )}
      </Formik>
  )
}

export default ProfileForm