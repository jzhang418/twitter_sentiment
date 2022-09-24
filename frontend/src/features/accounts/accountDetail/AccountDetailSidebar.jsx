import { Calendar } from 'react-calendar';
import { useSelector } from 'react-redux';
import { Header } from 'semantic-ui-react';

function AccountDetailSidebar({loading, onDateSelected}) {
  const { selectedDate } = useSelector((state => state.accountdetail));

  return (
    <>
        <Header icon='calendar' attached color='teal' content='Select Date' />
        <Calendar 
          onChange={date => {onDateSelected(date)}}
          value={typeof(selectedDate) === "string" ? new Date(selectedDate) : selectedDate}
          tileDisabled={() => loading}
        />
    </>
  )
}

export default AccountDetailSidebar