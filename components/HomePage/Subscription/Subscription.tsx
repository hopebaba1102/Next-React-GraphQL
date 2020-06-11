/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Formik, ErrorMessage, Form, Field,
} from 'formik';
import * as Yup from 'yup';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FetchResult } from 'apollo-link';
import get from 'lodash.get';
import s from './Subscription.scss';
import SUSCRIBE_MUTATION from './SUBSCRIBE.graphql';
import SUBSCRIPTIONS_QUERY from '../SubscriptionsTable/SUBSCRIPTIONS.graphql';
import { SubscribeMutation, SubscribeMutationVariables, Query } from '../../../__generated__/typescript-operations';

interface InitialValuesI {
  email: string;
}
interface HandleSubscribeI {
  values: InitialValuesI;
  subscribeMutation: Function;
  resetForm: Function;
}


const handleSubscribe: Function = async ({
  values,
  subscribeMutation,
  resetForm,
}: HandleSubscribeI) => {
  const subscribeResult: Promise<SubscribeMutation> = await subscribeMutation({
    variables: {
      input: {
        source: 'HOME_PAGE',
        ...values,
      },
    },
  });

  if (get(subscribeResult, 'data.subscribe')) {
    resetForm();
  }

  return subscribeResult;
};


const Subscription: React.FunctionComponent = () => {
  const [subscribeMutation] = useMutation<SubscribeMutation, SubscribeMutationVariables>(
    SUSCRIBE_MUTATION,
    {
      update: (cache, { data }: FetchResult): void => {
        const dataResult = cache.readQuery<Query>({ query: SUBSCRIPTIONS_QUERY });
        cache.writeQuery({
          query: SUBSCRIPTIONS_QUERY,
          data: {
            subscriptions: dataResult
            && dataResult.subscriptions
            && dataResult.subscriptions.concat([data && data.subscribe]),
          },
        });
      },
    },
  );
  const initialValues: InitialValuesI = {
    email: '',
  };
  return (
    <div className={s.Subscription}>
      <div className={s.Subscription__SubscriptionWrapper}>
        <div>
          <h2>
            Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
            industries for previewing layouts and visual mockups.
          </h2>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }): Promise<SubscribeMutation> => handleSubscribe({
              values,
              subscribeMutation,
              resetForm,
            })}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email()
                .required('Before submitting you need to provide your email'),
            })}
          >
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
                <ErrorMessage
                  name="email"
                  component="div"
                  className={s.Subscription__FieldError}
                />
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
