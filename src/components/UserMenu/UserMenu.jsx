import { Popover } from 'radix-ui';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  UserRoundCheck,
  LogOut,
  UserRoundCog,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import Loader from '../Loader/Loader.jsx';

import { logout } from '../../redux/auth/operations.js';
import { selectIsUserLoading, selectUser } from '../../redux/auth/selectors.js';

import css from './UserMenu.module.css';

const UserMenu = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const isUserLoading = useSelector(selectIsUserLoading);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleLogout = async () => {
    try {
      setOpen(false);
      await dispatch(logout()).unwrap();
      toast.success(t('LOGOUT_SUCCESS'));
    } catch (error) {
      toast.error(t('LOGOUT_ERROR') + error);
    }
  };

  return (
    <>
      <div className={css.wrapper}>
        {isUserLoading && <Loader loadingState={true} />}
        <UserRoundCheck size={28} color="#0d7fc4" strokeWidth={2} />

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            {open ? (
              <ChevronUp size={16} strokeWidth={3} />
            ) : (
              <ChevronDown size={16} strokeWidth={3} />
            )}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={css.popoverContent}
              sideOffset={5}
              align="end"
              alignOffset={-25}
            >
              <div className={css.menu}>
                <div className={css.userBlock}>
                  <p className={css.avatarMini}>{user.name[0]}</p>
                  <p className={css.text}>{user.name}</p>
                </div>

                <NavLink
                  className={css.link}
                  to="/profile"
                  onClick={handleClose}
                >
                  <UserRoundCog className={css.svgUser} />
                  {t('PROFILE')}
                </NavLink>
                <button
                  className={css.btn}
                  type="submit"
                  onClick={handleLogout}
                >
                  {t('EXIT')} <LogOut className={css.svgExit} />
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
};

export default UserMenu;
