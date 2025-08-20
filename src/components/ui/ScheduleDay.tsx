import React from 'react';

type ScheduleDayProps = {
  day: string;
};

const ScheduleDay: React.FC<ScheduleDayProps> = ({ day }) => {
  return (
    <section className="my-6">
      <h2 className="text-lg font-bold">{day} Schedule</h2>
      {/* Add schedule items here */}
    </section>
  );
};

export default ScheduleDay;
