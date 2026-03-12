import { pb } from '@lib/db';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from './auth';

function getInfo(data: any[]) {
  // Count user with is_eval_class is true
  const eval_course_count = data.filter((user) => user.is_eval_course).length;
  const eval_nr_count = data.filter((user) => user.is_eval_nr).length;
  const eval_ac_count = data.filter((user) => user.is_eval_ac).length;
  const eval_sr_count = data.filter((user) => user.is_eval_sr).length;
  const count_total = data.length;
  return {
    eval_course_count,
    eval_nr_count,
    eval_ac_count,
    eval_sr_count,
    count_total,
    data: [...data],
  };
}

export function useUser() {
  const auth = useAuth();
  async function getUsers() {
    if (!auth.data) return null;
    // get all users from users collection
    return pb.collection('users').getFullList();
  }

  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: !!auth.data,
  });

  // Filter user without student_id
  const data = query.data?.filter((user) => user.student_id ?? false) ?? [];

  // Sort data by student_id in ascending order
  data.sort((a, b) => a.student_id - b.student_id);

  return {
    isLoading: query.isLoading,
    info_all: getInfo(data),
    info_001: getInfo(data.filter((user) => user.sec === '001')),
    info_002: getInfo(data.filter((user) => user.sec === '002')),
    info_003: getInfo(data.filter((user) => user.sec === '003')),
    info_004: getInfo(data.filter((user) => user.sec === '004')),
    info_005: getInfo(data.filter((user) => user.sec === '005')),
    info_006: getInfo(data.filter((user) => user.sec === '006')),
    info_801: getInfo(data.filter((user) => user.sec === '801')),
    info_802: getInfo(data.filter((user) => user.sec === '802')),
    info_803: getInfo(data.filter((user) => user.sec === '803')),
    info_804: getInfo(data.filter((user) => user.sec === '804')),
    info_805: getInfo(data.filter((user) => user.sec === '805')),
    info_806: getInfo(data.filter((user) => user.sec === '806')),
  };
}
