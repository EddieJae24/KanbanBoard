import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

// 

// 

import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false); 

  // Create another state to filter tickets by status
  // const [filteredData, setFilteredData] = useState<any[]>([])
  
  // Create a filters object to store the status of the tickets
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'All',
    sort: 'asc'
  });
  
    // const sortTicketsByStatus = (ticketArray: TicketData[], status: string) => {
    //   // Sort tickets based on `filters.sort`
    //   return ticketArray
    //     .filter((ticket) => ticket.status === status)
    //     .sort((a, b) => {
    //       if (filters.sort === 'asc') {
    //         return a.name.localeCompare(b.name); // Alphabetical order
    //       }
    //       return b.name.localeCompare(a.name); // Reverse alphabetical order
    //     });
    // };
    
  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const sortAndFilterTickets = (tickets: TicketData[]) => {
    return tickets
      .filter((ticket) => {
        // Filter by status
        const statusMatch = filters.status === 'All' || ticket.status === filters.status;

        // Filter by search term
        const searchTermMatch = ticket.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

        return statusMatch && searchTermMatch;
      })
      .sort((a, b) => {
        if (filters.sort === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            <button  type='button' id='create-ticket-link'>
              <Link to='/create' className='newticket'>New Ticket</Link>
            </button>
            
            <div className='filters'>
            <input
              type='text'
              name='searchTerm'
              placeholder='Search tickets...'
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
            <select name='status' value={filters.status} onChange={handleFilterChange}>
              <option value='All'>All</option>
              {boardStates.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
            <select name='sort' value={filters.sort} onChange={handleFilterChange}>
              <option value='asc'>Ascending</option>
              <option value='desc'>Descending</option>
            </select>
          </div>

          <div className='board-display'>
            {filters.status === 'All'
              ? boardStates.map((status) => {
                  const filteredTickets = sortAndFilterTickets(tickets).filter(
                    (ticket) => ticket.status === status
                  );
                  return (
                    <Swimlane
                      title={status}
                      key={status}
                      tickets={filteredTickets}
                      deleteTicket={deleteIndvTicket}
                    />
                  );
                })

              : (() => {
                  const filteredTickets = sortAndFilterTickets(tickets).filter(
                    (ticket) => ticket.status === filters.status
                  );
                  return (
                    <div>
                    <Swimlane
                      title={filters.status}
                      key={filters.status}
                      tickets={filteredTickets}
                      deleteTicket={deleteIndvTicket}
                    />
                    </div>
                  );
                })()}
          </div>


          </div>
        )
    }
    </>
  );
};

export default Board;
