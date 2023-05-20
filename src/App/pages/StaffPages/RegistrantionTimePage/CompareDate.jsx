import Badge from '@/Core/components/common/Badge';
import React from 'react'

const CompareDate = ({ start, end }) => {
   if(!start || !end) {
      return <Badge variant="disabled">Chưa có</Badge>
   }
   const currentDate = new Date();
   const startComparisonDate = new Date(start);
   const endComparisonDate = new Date(end);
   if (currentDate < startComparisonDate) {
      return <Badge variant="info" size="xs">Sắp tới</Badge>
   } else if (currentDate > endComparisonDate) {
      return <Badge variant="error" size="xs">Đã kết thúc</Badge>
   } else {
      return <Badge variant="success" size="xs">Đang hoạt động</Badge>
   }
}

export default CompareDate