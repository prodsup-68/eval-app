import { pb } from '@lib/db';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from './auth';

export function useUpload() {
  const auth = useAuth();

  async function getUpload() {
    return pb
      .collection('uploads')
      .getFullList({ filter: `user = "${auth?.data?.id}"` });
  }

  const query = useQuery({
    queryKey: ['upload'],
    queryFn: getUpload,
    enabled: !!auth.data,
  });

  const _data = query.data ?? [];

  // Add fileUrl field
  const data = [] as any[];
  for (const record of _data) {
    const url = pb.files.getURL(record, record.image);
    data.push({ ...record, fileUrl: url });
  }

  // Separate data into 4 groups based on data.task value (course, nr, ac, sr)
  const course_arr = [];
  const nr_arr = [];
  const ac_arr = [];
  const sr_arr = [];
  for (const item of data as any[]) {
    if (item.task === 'course') {
      course_arr.push(item);
    } else if (item.task === 'nr') {
      nr_arr.push(item);
    } else if (item.task === 'ac') {
      ac_arr.push(item);
    } else if (item.task === 'sr') {
      sr_arr.push(item);
    }
  }

  // Sort each group by updated field in descending order
  course_arr.sort((a, b) => b.updated.localeCompare(a.updated));
  nr_arr.sort((a, b) => b.updated.localeCompare(a.updated));
  ac_arr.sort((a, b) => b.updated.localeCompare(a.updated));
  sr_arr.sort((a, b) => b.updated.localeCompare(a.updated));

  return {
    course_arr,
    nr_arr,
    ac_arr,
    sr_arr,
    course_len: course_arr.length,
    nr_len: nr_arr.length,
    ac_len: ac_arr.length,
    sr_len: sr_arr.length,
    data: query.data,
    isLoading: query.isLoading,
  };
}
