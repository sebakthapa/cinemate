import { Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from '_state';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useRecoilValue(authAtom);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth) {
          // not logged in so r to login page with the return url
          return <redirect to={{ pathname: '/signin', state: { from: props.location } }} />;
        }

        // authorized so return component
        return <Component {...props} />;
      }}
    />
  );
};
