import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTION,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  RECENT_ACTIVITIES,
  MONTHLY_ORDER_TRENDS
} from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper for local storage retrieval
const getInitialData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
  }
  return fallback;
};

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => getInitialData('ordercraft_orders', INITIAL_ORDERS));
  const [production, setProduction] = useState(() => getInitialData('ordercraft_production', INITIAL_PRODUCTION));
  const [inventory, setInventory] = useState(() => getInitialData('ordercraft_inventory', INITIAL_INVENTORY));
  const [customers, setCustomers] = useState(() => getInitialData('ordercraft_customers', INITIAL_CUSTOMERS));
  const [settings, setSettings] = useState(() => getInitialData('ordercraft_settings', INITIAL_SETTINGS));
  const [activities, setActivities] = useState(() => getInitialData('ordercraft_activities', RECENT_ACTIVITIES));
  
  // UI states
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(3);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ordercraft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ordercraft_production', JSON.stringify(production));
  }, [production]);

  useEffect(() => {
    localStorage.setItem('ordercraft_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ordercraft_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ordercraft_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ordercraft_activities', JSON.stringify(activities));
  }, [activities]);

  // Toast System
  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity logger helper
  const logActivity = (type, title, detail, badge) => {
    const newAct = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      type,
      title,
      detail,
      time: 'Just now',
      badge
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  // ---------------- ORDER OPERATIONS ----------------
  const addOrder = (orderData) => {
    const nextNum = 1051 + orders.length;
    const newOrder = {
      id: orderData.id || `ORD-${nextNum}`,
      status: orderData.status || 'Pending',
      orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
      totalAmount: Number(orderData.unitPrice || 0) * Number(orderData.quantity || 1),
      assignedLine: orderData.assignedLine || 'Unassigned',
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update customer's total spent & order count if applicable
    if (newOrder.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newOrder.customerId
            ? {
                ...c,
                ordersCount: (c.ordersCount || 0) + 1,
                totalSpent: (c.totalSpent || 0) + newOrder.totalAmount
              }
            : c
        )
      );
    }

    logActivity('order', 'New Order Created', `${newOrder.customerName} - ${newOrder.productName} (${newOrder.quantity} units)`, 'New Order');
    addToast({
      type: 'success',
      title: 'Order Created',
      message: `Order #${newOrder.id} successfully created.`
    });
    return newOrder;
  };

  const updateOrder = (id, updatedFields) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const totalAmount =
            updatedFields.unitPrice && updatedFields.quantity
              ? Number(updatedFields.unitPrice) * Number(updatedFields.quantity)
              : updatedFields.quantity
              ? Number(order.unitPrice) * Number(updatedFields.quantity)
              : updatedFields.unitPrice
              ? Number(updatedFields.unitPrice) * Number(order.quantity)
              : order.totalAmount;

          return { ...order, ...updatedFields, totalAmount };
        }
        return order;
      })
    );
    addToast({
      type: 'info',
      title: 'Order Updated',
      message: `Order #${id} has been modified.`
    });
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: newStatus } : order))
    );
    logActivity('order', 'Order Status Changed', `Order #${id} updated to ${newStatus}`, newStatus);
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Order #${id} marked as ${newStatus}.`
    });
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    addToast({
      type: 'warning',
      title: 'Order Deleted',
      message: `Order #${id} was deleted.`
    });
  };

  // ---------------- PRODUCTION OPERATIONS ----------------
  const addProductionRun = (runData) => {
    const nextNum = 809 + production.length;
    const newRun = {
      id: runData.id || `PRD-${nextNum}`,
      progress: Number(runData.progress || 0),
      status: runData.status || 'Scheduled',
      stage: runData.stage || 'Material Preparation',
      startDate: runData.startDate || new Date().toISOString().split('T')[0],
      ...runData
    };

    setProduction((prev) => [newRun, ...prev]);

    // Also update order status if linked
    if (newRun.orderId) {
      setOrders((prev) =>
        prev.map((o) => (o.id === newRun.orderId ? { ...o, status: 'In Production', assignedLine: newRun.workstation } : o))
      );
    }

    logActivity('production', 'Production Batch Scheduled', `Batch #${newRun.id} allocated to ${newRun.workstation}`, 'Scheduled');
    addToast({
      type: 'success',
      title: 'Production Run Scheduled',
      message: `Batch #${newRun.id} created successfully.`
    });
    return newRun;
  };

  const updateProductionRun = (id, updatedFields) => {
    setProduction((prev) =>
      prev.map((run) => {
        if (run.id === id) {
          const updated = { ...run, ...updatedFields };
          // Auto sync status if progress reaches 100%
          if (updated.progress >= 100 && updated.status !== 'Completed') {
            updated.status = 'Completed';
            updated.stage = 'Final Inspection Passed';
          }
          return updated;
        }
        return run;
      })
    );
    addToast({
      type: 'info',
      title: 'Production Updated',
      message: `Batch #${id} updated.`
    });
  };

  const updateProductionProgress = (id, newProgress) => {
    const clampedProgress = Math.min(100, Math.max(0, Number(newProgress)));
    setProduction((prev) =>
      prev.map((run) => {
        if (run.id === id) {
          let updatedStatus = run.status;
          let updatedStage = run.stage;

          if (clampedProgress === 100) {
            updatedStatus = 'Completed';
            updatedStage = 'Final Inspection Passed';
          } else if (clampedProgress > 0 && run.status === 'Scheduled') {
            updatedStatus = 'In Progress';
            updatedStage = 'In Active Machining/Assembly';
          }

          return {
            ...run,
            progress: clampedProgress,
            status: updatedStatus,
            stage: updatedStage
          };
        }
        return run;
      })
    );
  };

  const updateProductionStatus = (id, newStatus) => {
    setProduction((prev) =>
      prev.map((run) => {
        if (run.id === id) {
          let newProgress = run.progress;
          if (newStatus === 'Completed') newProgress = 100;
          if (newStatus === 'In Progress' && run.progress === 0) newProgress = 25;
          return { ...run, status: newStatus, progress: newProgress };
        }
        return run;
      })
    );
    logActivity('production', 'Production Status Changed', `Batch #${id} marked as ${newStatus}`, newStatus);
    addToast({
      type: 'info',
      title: 'Production Status',
      message: `Batch #${id} is now ${newStatus}.`
    });
  };

  const deleteProductionRun = (id) => {
    setProduction((prev) => prev.filter((run) => run.id !== id));
    addToast({
      type: 'warning',
      title: 'Production Batch Removed',
      message: `Batch #${id} has been deleted.`
    });
  };

  // ---------------- INVENTORY OPERATIONS ----------------
  const calculateStockStatus = (qty, minStock) => {
    const q = Number(qty);
    const m = Number(minStock);
    if (q <= 0) return 'Out of Stock';
    if (q <= m) return 'Low Stock';
    return 'In Stock';
  };

  const addInventoryItem = (itemData) => {
    const nextNum = 113 + inventory.length;
    const availableQty = Number(itemData.availableQty || 0);
    const minStock = Number(itemData.minStock || 0);
    const stockStatus = calculateStockStatus(availableQty, minStock);

    const newItem = {
      id: itemData.id || `INV-${nextNum}`,
      availableQty,
      minStock,
      stockStatus,
      lastRestocked: new Date().toISOString().split('T')[0],
      ...itemData
    };

    setInventory((prev) => [newItem, ...prev]);
    logActivity('inventory', 'New Inventory SKU Added', `${newItem.name} added to ${newItem.location}`, stockStatus);
    addToast({
      type: 'success',
      title: 'Item Added',
      message: `${newItem.name} added to inventory catalog.`
    });
    return newItem;
  };

  const updateInventoryItem = (id, updatedFields) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const qty = updatedFields.availableQty !== undefined ? Number(updatedFields.availableQty) : item.availableQty;
          const min = updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : item.minStock;
          const status = calculateStockStatus(qty, min);
          return {
            ...item,
            ...updatedFields,
            availableQty: qty,
            minStock: min,
            stockStatus: status
          };
        }
        return item;
      })
    );
    addToast({
      type: 'info',
      title: 'Inventory Updated',
      message: `Item #${id} modified.`
    });
  };

  const adjustStock = (id, deltaQty) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, Number(item.availableQty) + Number(deltaQty));
          const newStatus = calculateStockStatus(newQty, item.minStock);
          return {
            ...item,
            availableQty: newQty,
            stockStatus: newStatus,
            lastRestocked: deltaQty > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked
          };
        }
        return item;
      })
    );

    const deltaSign = deltaQty > 0 ? `+${deltaQty}` : `${deltaQty}`;
    addToast({
      type: deltaQty > 0 ? 'success' : 'info',
      title: 'Stock Adjusted',
      message: `Item #${id} stock adjusted by ${deltaSign}.`
    });
  };

  const deleteInventoryItem = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    addToast({
      type: 'warning',
      title: 'Item Deleted',
      message: `SKU #${id} removed from inventory.`
    });
  };

  // ---------------- CUSTOMER OPERATIONS ----------------
  const addCustomer = (custData) => {
    const nextNum = 107 + customers.length;
    const newCust = {
      id: custData.id || `CUST-${nextNum}`,
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      ...custData
    };

    setCustomers((prev) => [newCust, ...prev]);
    addToast({
      type: 'success',
      title: 'Customer Added',
      message: `${newCust.company} added to customer directory.`
    });
    return newCust;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === id ? { ...cust, ...updatedFields } : cust))
    );
    addToast({
      type: 'info',
      title: 'Customer Updated',
      message: `Customer profile updated.`
    });
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((cust) => cust.id !== id));
    addToast({
      type: 'warning',
      title: 'Customer Removed',
      message: `Customer #${id} removed from directory.`
    });
  };

  // ---------------- SETTINGS & RESET ----------------
  const updateSettings = (section, newValues) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newValues
      }
    }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: `${section.charAt(0).toUpperCase() + section.slice(1)} preferences updated successfully.`
    });
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setProduction(INITIAL_PRODUCTION);
    setInventory(INITIAL_INVENTORY);
    setCustomers(INITIAL_CUSTOMERS);
    setSettings(INITIAL_SETTINGS);
    setActivities(RECENT_ACTIVITIES);

    localStorage.removeItem('ordercraft_orders');
    localStorage.removeItem('ordercraft_production');
    localStorage.removeItem('ordercraft_inventory');
    localStorage.removeItem('ordercraft_customers');
    localStorage.removeItem('ordercraft_settings');
    localStorage.removeItem('ordercraft_activities');

    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All system records have been restored to initial sample manufacturing data.'
    });
  };

  // ---------------- COMPUTED METRICS ----------------
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
  const activeProductionCount = production.filter((p) => p.status === 'In Progress' || p.status === 'Scheduled').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length;
  const lowStockItemsCount = inventory.filter((i) => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (Number(i.availableQty) * Number(i.unitCost) || 0), 0);

  const value = {
    // State
    orders,
    production,
    inventory,
    customers,
    settings,
    activities,
    globalSearch,
    setGlobalSearch,
    toasts,
    unreadAlertsCount,
    setUnreadAlertsCount,
    monthlyTrends: MONTHLY_ORDER_TRENDS,

    // Metrics
    metrics: {
      totalOrders: totalOrdersCount,
      pendingOrders: pendingOrdersCount,
      activeProduction: activeProductionCount,
      completedOrders: completedOrdersCount,
      lowStockCount: lowStockItemsCount,
      totalRevenue,
      totalInventoryValue
    },

    // Handlers
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,

    addProductionRun,
    updateProductionRun,
    updateProductionProgress,
    updateProductionStatus,
    deleteProductionRun,

    addInventoryItem,
    updateInventoryItem,
    adjustStock,
    deleteInventoryItem,

    addCustomer,
    updateCustomer,
    deleteCustomer,

    updateSettings,
    resetDemoData,

    addToast,
    removeToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
