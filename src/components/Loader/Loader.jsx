import { ScaleLoader } from 'react-spinners';

import css from './Loader.module.css';

const Loader = ({ loadingState }) => {
  return (
    <div className={css.wrapper}>
      <ScaleLoader
        className={css.loader}
        loading={loadingState}
        aria-label="Loading Spinner"
        data-testid="loader"
        color="#3b82f6"
      />
    </div>
  );
};

export default Loader;
