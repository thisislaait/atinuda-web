type WorkshopEventProps = {
  day: string;
};

const WorkshopEvent: React.FC<WorkshopEventProps> = ({ day }) => {
  return (
    <section className="my-6">
      <h3 className="text-md font-semibold">{day} Workshop Event</h3>
      {/* Add event content here */}
    </section>
  );
};

export default WorkshopEvent;
