import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Battery, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Power, 
  Server, 
  Settings, 
  TrendingUp, 
  Users, 
  Wifi,
  Zap,
  Eye,
  RefreshCw,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  details: {
    description: string;
    lastUpdated: string;
    threshold: number;
    history: number[];
  };
}

interface Service {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: string;
  cpu: number;
  memory: number;
  description: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState<SystemMetric | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Mock data
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: '1',
      name: 'CPU Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      details: {
        description: 'Current CPU utilization across all cores',
        lastUpdated: '2 minutes ago',
        threshold: 80,
        history: [45, 52, 61, 68, 72, 68]
      }
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 42,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      details: {
        description: 'RAM utilization including cache and buffers',
        lastUpdated: '1 minute ago',
        threshold: 85,
        history: [38, 41, 39, 42, 44, 42]
      }
    },
    {
      id: '3',
      name: 'Network I/O',
      value: 156,
      unit: 'MB/s',
      status: 'healthy',
      trend: 'up',
      details: {
        description: 'Combined inbound and outbound network traffic',
        lastUpdated: '30 seconds ago',
        threshold: 500,
        history: [120, 134, 145, 156, 162, 156]
      }
    },
    {
      id: '4',
      name: 'Disk Usage',
      value: 89,
      unit: '%',
      status: 'critical',
      trend: 'up',
      details: {
        description: 'Primary storage volume utilization',
        lastUpdated: '5 minutes ago',
        threshold: 90,
        history: [82, 85, 87, 89, 91, 89]
      }
    }
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Web Server',
      status: 'running',
      uptime: '15d 4h 23m',
      cpu: 12,
      memory: 256,
      description: 'Primary HTTP/HTTPS web server handling client requests'
    },
    {
      id: '2',
      name: 'Database',
      status: 'running',
      uptime: '15d 4h 23m',
      cpu: 8,
      memory: 512,
      description: 'PostgreSQL database server for application data'
    },
    {
      id: '3',
      name: 'Cache Server',
      status: 'running',
      uptime: '7d 12h 45m',
      cpu: 3,
      memory: 128,
      description: 'Redis cache server for session and data caching'
    },
    {
      id: '4',
      name: 'Backup Service',
      status: 'stopped',
      uptime: '0d 0h 0m',
      cpu: 0,
      memory: 0,
      description: 'Automated backup service for data protection'
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update metrics with random variations
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
      details: {
        ...metric.details,
        lastUpdated: 'Just now'
      }
    })));
    
    setIsRefreshing(false);
  };

  const handleServiceAction = (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    setServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        switch (action) {
          case 'start':
            return { ...service, status: 'running' as const };
          case 'stop':
            return { ...service, status: 'stopped' as const, cpu: 0, memory: 0 };
          case 'restart':
            return { ...service, status: 'running' as const };
          default:
            return service;
        }
      }
      return service;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
      case 'error':
        return 'text-red-500';
      case 'stopped':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'critical':
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'stopped':
        return <Square className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">Astrikos</h1>
            </div>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Enterprise Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearNotifications}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 relative"
            >
              <Activity className="h-4 w-4 mr-2" />
              Alerts
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-cyan-600">
              <Server className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-cyan-600">
              <Globe className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric) => (
                <Dialog key={metric.id}>
                  <DialogTrigger asChild>
                    <Card 
                      className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg bg-slate-800/50 border-slate-700 hover:border-cyan-500"
                      onClick={() => setSelectedMetric(metric)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">
                          {metric.name}
                        </CardTitle>
                        <div className={getStatusColor(metric.status)}>
                          {getStatusIcon(metric.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {metric.value}{metric.unit}
                        </div>
                        <Progress 
                          value={metric.value} 
                          className="mt-2"
                          // @ts-ignore
                          indicatorClassName={
                            metric.status === 'critical' ? 'bg-red-500' :
                            metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }
                        />
                        <p className="text-xs text-slate-400 mt-2">
                          {metric.details.lastUpdated}
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">{metric.name} Details</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        {metric.details.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Current Value</p>
                          <p className="text-2xl font-bold text-white">
                            {metric.value}{metric.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Threshold</p>
                          <p className="text-2xl font-bold text-white">
                            {metric.details.threshold}{metric.unit}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="bg-slate-700" />
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Recent History</p>
                        <div className="flex items-end space-x-1 h-20">
                          {metric.details.history.map((value, index) => (
                            <div
                              key={index}
                              className="bg-cyan-500 rounded-t"
                              style={{
                                height: `${(value / 100) * 80}px`,
                                width: '20px'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                          Configure Alerts
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">
                  Common system operations and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 h-20 flex-col">
                    <Power className="h-6 w-6 mb-2" />
                    System Health
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-20 flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    Backup Now
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    User Management
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700 h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-4">
              {services.map((service) => (
                <Dialog key={service.id}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={getStatusColor(service.status)}>
                            {getStatusIcon(service.status)}
                          </div>
                          <div>
                            <CardTitle className="text-white">{service.name}</CardTitle>
                            <CardDescription className="text-slate-400">
                              {service.description}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={service.status === 'running' ? 'default' : 'secondary'}
                            className={service.status === 'running' ? 'bg-green-600' : 'bg-gray-600'}
                          >
                            {service.status}
                          </Badge>
                          
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Uptime</p>
                          <p className="text-white font-medium">{service.uptime}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">CPU</p>
                          <p className="text-white font-medium">{service.cpu}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Memory</p>
                          <p className="text-white font-medium">{service.memory}MB</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        {service.status === 'stopped' ? (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleServiceAction(service.id, 'start')}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleServiceAction(service.id, 'stop')}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => handleServiceAction(service.id, 'restart')}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">{service.name}</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Service configuration and monitoring
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Status</p>
                          <div className="flex items-center space-x-2">
                            <div className={getStatusColor(service.status)}>
                              {getStatusIcon(service.status)}
                            </div>
                            <span className="text-white capitalize">{service.status}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Uptime</p>
                          <p className="text-white">{service.uptime}</p>
                        </div>
                      </div>
                      
                      <Separator className="bg-slate-700" />
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Resource Usage</p>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">CPU</span>
                              <span className="text-white">{service.cpu}%</span>
                            </div>
                            <Progress value={service.cpu} className="mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Memory</span>
                              <span className="text-white">{service.memory}MB</span>
                            </div>
                            <Progress value={(service.memory / 1024) * 100} className="mt-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wifi className="h-5 w-5 mr-2 text-cyan-400" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Connection</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bandwidth</span>
                    <span className="text-white">1 Gbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Latency</span>
                    <span className="text-white">12ms</span>
                  </div>
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Run Network Test
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-cyan-400" />
                    Power Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Power State</span>
                    <Badge className="bg-green-600">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Efficiency</span>
                    <span className="text-white">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Temperature</span>
                    <span className="text-white">42°C</span>
                  </div>
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Power Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    User Management
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
                    <Settings className="h-6 w-6 mb-2" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    Backup Config
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
                    <Activity className="h-6 w-6 mb-2" />
                    Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-slate-800/50 border-slate-700">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-white">System Update Available</AlertTitle>
              <AlertDescription className="text-slate-400">
                A new system update is available. Click to review and install.
                <Button size="sm" className="ml-4 bg-cyan-600 hover:bg-cyan-700">
                  Update Now
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;