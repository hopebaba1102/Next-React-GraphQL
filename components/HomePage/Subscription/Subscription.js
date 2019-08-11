/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Formik, ErrorMessage, Form, Field } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';
import s from './Subscription.scss';
import SUSCRIBE_MUTATION from './Subscribe.graphql';
import SUBSCRIPTIONS_QUERY from '../SubscriptionsTable/Subscriptions.graphql';

const handleSubsribe = async ({ values, subscribeMutation, resetForm }) => {
  const subscribeResult = await subscribeMutation({
    variables: { input: values }
  });
  if (get(subscribeResult, 'data.subscribe')) {
    resetForm();
  }
};

const Subscription = () => {
  const [subscribeMutation] = useMutation(SUSCRIBE_MUTATION, {
    update: (cache, { data: { subscribe } }) => {
      const { subscriptions } = cache.readQuery({ query: SUBSCRIPTIONS_QUERY });
      cache.writeQuery({
        query: SUBSCRIPTIONS_QUERY,
        data: {
          subscriptions: subscriptions.concat([subscribe])
        }
      });
    }
  });

  return (
    <div className={s.Subscription} name="subscription">
      <div className={s.Subscription__SubscriptionWrapper}>
        <div>
          <h2>
            Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
            industries for previewing layouts and visual mockups.
          </h2>
          <Formik
            initialValues={{
              email: ''
            }}
            onSubmit={async (values, { resetForm }) =>
              handleSubsribe({
                values,
                subscribeMutation,
                resetForm
              })
            }
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email()
                .required('Before submitting you need to provide your email')
            })}
            render={() => (
              <Form>
                <div className={s.Subscription__Row}>
                  <label htmlFor="email">Email</label>
                  <Field
                    id="email"
                    className={s.Carousel__EmailInput}
                    name="email"
                    placeholder="your@email.com"
                    type="email"
                  />
                  <button type="submit" className={s.Subscription__SubscribeButton}>
                    Subscribe
                  </button>
                </div>
                <div className={s.Subscription__FieldErrorRow}>
                  {' '}
                  <ErrorMessage
                    name="email"
                    component="div"
                    className={s.Subscription__FieldError}
                  />
                </div>
              </Form>
            )}
          />
        </div>
        )
      </div>
    </div>
  );
};

export default Subscription;
