import Dropdown from '../components/Dropdown/Dropdown';

const Home = () => {
  return (
    <div className='flex flex-col'>
      {/* Header */}
      <div className='flex bg-orange-600 text-neutral-50 text-center py-3 px-3 justify-between items-center'>
        <h1 className='font-bold text-3xl uppercase'>
          Monitoreo de entrada - CUCEI
        </h1>
        <Dropdown
          className='text-neutral-800'
          items={[{ id: 0, name: 'Puerta 1' }]}
        />
      </div>
      {/* Content */}
      <div>{/* TODO: Add content */}</div>
    </div>
  );
};

export default Home;
