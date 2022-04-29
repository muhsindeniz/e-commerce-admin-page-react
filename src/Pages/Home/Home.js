import React, { useContext, useEffect, useState } from 'react'
import { GlobalSettingsContext } from '../../Contexts/GlobalSettingsContext';
import { CompanySettingsContext } from '../../Contexts/CompanySettingsContext';
import axios from 'axios';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {

  let { mobile } = useContext(GlobalSettingsContext)
  let { name } = useContext(CompanySettingsContext);
  let [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/allOrders')
      .then(resp => {
        setOrders(resp.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])


  // useEffect(() => {
  //   if (orders) {
  //     let su = orders.filter(a => a.category === 'vegetables').map(a => a.data).reduce((a, b) => a + b, 0);
  //   }
  // }, [orders])

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Satış özetleri',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const labels = ['Meyveler', 'Sebzeler', 'Doğal Çaylar', 'Doğal Bitkiler']

  const data = {
    labels,
    datasets: [
      {
        label: 'Toplam satış miktarları ( $ )',
        data: [
          orders.filter(a => a.category === 'vegetables').map(a => a.data).reduce((a, b) => a + b, 0),
          orders.filter(a => a.category === 'Fruit').map(a => a.data).reduce((a, b) => a + b, 0),
          orders.filter(a => a.category === 'Teas').map(a => a.data).reduce((a, b) => a + b, 0),
          orders.filter(a => a.category === 'Plants').map(a => a.data).reduce((a, b) => a + b, 0)
        ],
        backgroundColor: `rgba(${Math.floor(Math.random() * 235)}, ${Math.floor(Math.random() * 235)}, ${Math.floor(Math.random() * 235)}, 0.5)`,
      }
    ],
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="m-0">Kategorik Satış Özetleri</h3>
        </div>

        <div className="card-body">
          <Bar options={options} data={data} />

        </div>
      </div>
    </>
  )
}

export default Home
