import { FaAngleDown, FaUser } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { Popover } from 'radix-ui';
import { NavLink } from 'react-router-dom';

import { useState } from 'react';

import css from './UserMenu.module.css';
import { logout } from '../../redux/auth/operations.js';
import { useDispatch } from 'react-redux';

const UserMenu = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
  };

  return (
    <div className={css.wrapper}>
      <p className={css.avatar}>S</p>
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
                <p className={css.avatarMini}>S</p>
                <p className={css.text}>UserName</p>
              </div>

              <NavLink className={css.link} to="/profile" onClick={handleClose}>
                <FaUser className={css.svg} />
                Perfil do utilizador
              </NavLink>
              <button className={css.btn} type="submit" onClick={handleLogout}>
                <IoExitOutline className={css.svg} />
                Sair
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default UserMenu;
