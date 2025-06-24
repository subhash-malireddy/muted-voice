import React, { useState, useTransition } from 'react';
import { deleteAdmin } from '@baseline/client-api/admin';
import ConfirmDelete from '../../../../components/confirm-delete/ConfirmDelete';
import AddAdmin from '../add-admin/AddAdmin';
import styles from './AdminList.module.scss';
import { getRequestHandler } from '@baseline/client-api/request-handler';
import { Admin } from '@baseline/types/admin';

interface AdminListProps {
  admins: Admin[];
}

const AdminList = ({ admins = [] }: AdminListProps): JSX.Element => {
  const [allAdmins, setAllAdmins] = useState<Admin[]>(admins);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (adminSub: string): void => {
    startTransition(() => {
      deleteAdmin(getRequestHandler(), { adminId: adminSub })
        .then(() => {
          setAllAdmins((admins) =>
            admins.filter((admin) => admin.userSub !== adminSub),
          );
        })
        .catch((error) => {
          console.error('Failed to delete admin:', error);
        });
    });
  };

  return (
    <div className={styles.userList}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.userCount}>
            There are {allAdmins.length} people in your team
          </div>
          <AddAdmin setAllAdmins={setAllAdmins} />
        </div>
        {allAdmins.map((admin) => (
          <div key={admin.userSub} className={styles.admin}>
            <div className={styles.info}>
              <div className={styles.details}>
                <div className={styles.name}>{admin.userEmail}</div>
                <div className={styles.data}>{admin.userSub}</div>
              </div>
              <div className={styles.pill}>Admin</div>
            </div>
            <div className={styles.buttons}>
              <ConfirmDelete
                itemName={admin.userEmail}
                deleteFunction={() => handleDelete(admin.userSub)}
                isLoading={isPending}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
