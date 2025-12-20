import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
// Import đầy đủ icon, bao gồm Receipt
import { CurrencyDollar, People, CalendarCheck, ArrowUpRight, Receipt } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ income: 0, customers: 0, pending: 0, chartData: [], recentActivity: [] });

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-Polling: Cập nhật mỗi 5 giây
    const interval = setInterval(() => {
        fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className={`position-absolute top-0 end-0 p-3 opacity-25 text-${color}`} style={{ fontSize: '4rem', transform: 'translate(10%, -10%)' }}>{icon}</div>
        <Card.Body className="p-4">
          <div className={`d-inline-flex p-3 rounded-circle bg-${color} bg-opacity-10 text-${color} mb-3`}>{icon}</div>
          <h3 className="fw-bold mb-1 text-dark">{value}</h3>
          <p className="text-muted mb-0">{title}</p>
        </Card.Body>
      </Card>
    </motion.div>
  );

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Tổng Quan</h2>
        <p className="text-muted">Chào mừng trở lại, Admin!</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}><StatCard title="Doanh thu tháng này" value={`${stats.income.toLocaleString()} ₫`} icon={<CurrencyDollar/>} color="success" delay={0.1}/></Col>
        <Col md={4}><StatCard title="Tổng khách hàng" value={stats.customers} icon={<People/>} color="primary" delay={0.2}/></Col>
        <Col md={4}><StatCard title="Lịch hẹn chờ khám" value={stats.pending} icon={<CalendarCheck/>} color="warning" delay={0.3}/></Col>
      </Row>

      <Row>
        <Col lg={8}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark">Biểu đồ doanh thu</h5>
                <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill"><ArrowUpRight/> +12.5%</Badge>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={stats.chartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#20c997" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#20c997" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                    <XAxis dataKey="Date" axisLine={false} tickLine={false} tick={{fill: '#adb5bd'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#adb5bd'}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="Revenue" stroke="#20c997" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col lg={4}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '24px' }}>
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="fw-bold">Hoạt động gần đây</h5>
                <small className="text-muted fst-italic">Tự động cập nhật...</small>
              </Card.Header>
              <Card.Body>
                {/* RENDER DỮ LIỆU THẬT */}
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((act, idx) => (
                    <div className="d-flex gap-3 mb-4" key={idx}>
                      <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${act.Type === 'Booking' ? 'bg-primary' : 'bg-success'} bg-opacity-10`} style={{width: 40, height: 40}}>
                        {act.Type === 'Booking' ? <CalendarCheck className="text-primary"/> : <Receipt className="text-success"/>}
                      </div>
                      <div>
                        <p className="mb-0 fw-bold small">
                          {act.Type === 'Booking' ? `Lịch hẹn: ${act.HoTen}` : `Thanh toán: ${act.HoTen}`}
                        </p>
                        <small className="text-muted">
                          {new Date(act.NgayGioHen || act.NgayTao).toLocaleString('vi-VN')}
                          {act.TongTien && ` - ${act.TongTien.toLocaleString()}đ`}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                    <p className="text-muted text-center small mt-3">Chưa có hoạt động mới</p>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

// Component Badge nội bộ
const Badge = ({children, className, bg}) => <span className={`badge bg-${bg} ${className}`}>{children}</span>;

export default AdminDashboard;