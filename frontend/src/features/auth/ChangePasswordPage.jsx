import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Header, Label, Segment } from "semantic-ui-react";
import * as Yup from "yup";
import MyTextInput from "../../app/common/form/MySelectInput";
import { updateUserPassword } from "../../app/firestore/firebaseService";

export default function ChangePasswordPage() {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <Segment>
      <Header dividing size='large' content='Account' />
      {currentUser.providerId === "password" && (
        <>
          <Header color='teal' sub content='Change Password' />
          <p>Use this form to change your password</p>
          <Formik
            initialValues={{ newPassword1: "", newPassword2: "" }}
            validationSchema={Yup.object({
              newPassword1: Yup.string().required("Password is required"),
              newPassword2: Yup.string().oneOf([Yup.ref("newPassword1"), null]),
            })}
            onSubmit={async (values, {setSubmitting, setErrors}) => {
              try {
                await updateUserPassword(values);
              } catch (error) {
                setErrors({auth: error.message});
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, isValid, dirty, errors }) => (
              <Form className='ui form'>
                <MyTextInput
                  name='newPassword1'
                  type='password'
                  placeholder='New Password'
                />
                <MyTextInput
                  name='newPassword2'
                  type='password'
                  placeholder='Confirm Password'
                />
                {errors.auth && (
                  <Label
                    basic
                    color='red'
                    style={{ marginBottom: 10 }}
                    content={errors.auth}
                  />
                )}
                <Button
                  style={{display: 'block'}}
                  type='submit'
                  disabled={!isValid || !dirty || isSubmitting}
                  loading={isSubmitting}
                  size='large'
                  positive
                  content='Update password'
                />
              </Form>
            )}
          </Formik>
        </>
      )}
      {currentUser.providerId === "google.com" && (
        <>
          <Header color='teal' sub content='Google account' />
          <p>Please visit Google to update your account</p>
          <Button
            icon='google'
            color='google plus'
            as={Link}
            to='https://google.com'
            content='Go to Google'
          />
        </>
      )}
    </Segment>
  );
}
