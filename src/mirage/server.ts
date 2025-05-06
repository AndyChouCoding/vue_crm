import { createServer, Model, Response } from 'miragejs'

interface UserAttrs {
  id: string; name: string; username: string;
  password: string; role:'agent'|'manager'; photo:string
}
interface CustomerAttrs { id:string; name:string; agentId:string; photo:string }
interface TicketAttrs {
  id:string; subject:string; status:'open'|'pending'|'closed';
  createdAt:string; customerId:string; agentId:string
}
interface MessageAttrs {
  id:string; content:string; ticketId:string;
  timestamp:string; platform:'line'|'fb'
}

export function makeServer() {
  return createServer({
    models: {
      user:     Model.extend<Partial<UserAttrs>>({}),
      customer: Model.extend<Partial<CustomerAttrs>>({}),
      ticket:   Model.extend<Partial<TicketAttrs>>({}),
      message:  Model.extend<Partial<MessageAttrs>>({})
    },
    seeds(server) {
      server.db.loadData({
        users: [
          { id:'manager0', name:'Manager',     username:'manager', password:'123456', role:'manager', photo:'/images/user/manager.jpeg' },
          { id:'agent0',   name:'Alice Agent', username:'agent',   password:'123456',    role:'agent',   photo:'/images/user/agent.jpeg' }
        ]
      });
      server.db.customers.insert([
        { id:'cust1', name:'John Doe',   agentId:'agent0', photo:'/images/user/default.png' },
        { id:'cust2', name:'Jane Smith', agentId:'agent0', photo:'/images/user/default.png' }
      ]);
      const now = new Date().toISOString();
      server.db.tickets.insert([
        { id:'t1', subject:'問題A', status:'pending', createdAt:now, customerId:'cust1', agentId:'agent0' },
        { id:'t2', subject:'問題B', status:'open',    createdAt:now, customerId:'cust2', agentId:'agent0' }
      ]);
      server.db.messages.insert([]);
    },
    routes() {
      this.namespace = 'api'

      // Auth
      this.post('/auth/login', (schema, req) => {
        const { username, password } = JSON.parse(req.requestBody)
        const u = schema.db.users.findBy({ username, password })
        if (!u) return new Response(401, {}, { error:'Invalid credentials' })
        return { token:'mock-token', user:u }
      })
      this.get('/auth/me', (schema, req) => {
        const auth = req.requestHeaders.Authorization
        if (auth !== 'Bearer mock-token') return new Response(401)
        // 简单返回第一个 agent（真实项目请用 token 解码）
        const u = schema.db.users.where({ role:'agent' })[0]
        return { user:u }
      })

      // Users / Customers / Tickets / Messages
      this.get('/users',    (s, r) => ({ users: s.db.users.where({ role:r.queryParams.role }) }))
      this.get('/customers',(s, r) => ({ customers: s.db.customers.where({ agentId:r.queryParams.agentId }) }))
      this.get('/tickets',  (s, r) => ({ tickets: s.db.tickets.where({ agentId:r.queryParams.agentId }) }))
      this.get('/tickets/:id',   (s, r) => ({ status: s.db.tickets.find(r.params.id).status }))
      this.patch('/tickets/:id', (s, r) => {
        const attrs = JSON.parse(r.requestBody)
        s.db.tickets.update(r.params.id, attrs)
        return s.db.tickets.find(r.params.id)
      })
      this.get('/tickets/:id/messages',  (s, r) => ({ messages: s.db.messages.where({ ticketId:r.params.id }) }))
      this.post('/tickets/:id/messages', (s, r) => {
        const attrs = JSON.parse(r.requestBody)
        return s.db.messages.insert({ ...attrs, id:String(Date.now()), ticketId:r.params.id })
      })
    }
  })
}
