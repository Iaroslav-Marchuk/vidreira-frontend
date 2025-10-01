import { FaAngleDown, FaUser } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { Popover } from 'radix-ui';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import Loader from '../Loader/Loader.jsx';

import { logout } from '../../redux/auth/operations.js';
import { selectIsLoading, selectUser } from '../../redux/auth/selectors.js';

import css from './UserMenu.module.css';

const UserMenu = () => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleLogout = async () => {
    try {
      setOpen(false);
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to log out. ' + error);
    }
  };

  return (
    <>
      <div className={css.wrapper}>
        {isLoading && <Loader loadingState={true} />}
        <p className={css.avatar}>{user.name[0]}</p>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <FaAngleDown />
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
                  <FaUser className={css.svg} />
                  Perfil do utilizador
                </NavLink>
                <button
                  className={css.btn}
                  type="submit"
                  onClick={handleLogout}
                >
                  <IoExitOutline className={css.svg} />
                  Sair
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
