import { supabase, authHelpers, db } from '../lib/supabaseClient.js'

class AdminApp {
  constructor() {
    this.currentUser = null
    this.currentView = 'pages'
    this.editingPageId = null
    this.pages = []
    this.navItems = []
    this.settings = {}
    this.init()
  }

  async init() {
    this.showLoading()
    await this.checkAuth()
    this.setupAuthListener()
  }

  showLoading() {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>
    `
  }

  async checkAuth() {
    const user = await authHelpers.getCurrentUser()

    if (!user) {
      this.showLogin()
      return
    }

    if (!authHelpers.isIntelliCloudUser(user)) {
      this.showAccessDenied()
      return
    }

    const hasAccess = await authHelpers.checkAdminAccess(user)
    if (!hasAccess) {
      this.showAccessDenied()
      return
    }

    this.currentUser = user
    this.showDashboard()
  }

  setupAuthListener() {
    authHelpers.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await this.checkAuth()
      } else {
        this.showLogin()
      }
    })
  }

  showLogin() {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">IntelliCloud</h1>
            <p class="text-gray-600">Admin Dashboard</p>
          </div>

          <div class="space-y-4">
            <button id="googleSignIn" class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-gray-400 hover:shadow-md transition-all">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <p class="text-sm text-gray-500 text-center">
              Only @intellicloud.com accounts are allowed
            </p>
          </div>
        </div>
      </div>
    `

    document.getElementById('googleSignIn').addEventListener('click', async () => {
      const { error } = await authHelpers.signInWithGoogle()
      if (error) {
        alert('Error signing in: ' + error.message)
      }
    })
  }

  showAccessDenied() {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div class="text-red-600 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p class="text-gray-600 mb-6">You don't have permission to access this admin panel. Only authorized @intellicloud.com users can access this area.</p>
          <button id="signOutBtn" class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    `

    document.getElementById('signOutBtn').addEventListener('click', async () => {
      await authHelpers.signOut()
    })
  }

  showDashboard() {
    document.getElementById('app').innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <h1 class="text-xl font-bold text-gray-900">IntelliCloud Admin</h1>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600">${this.currentUser.email}</span>
                <button id="signOutBtn" class="text-sm text-gray-600 hover:text-gray-900">Sign Out</button>
              </div>
            </div>
          </div>
        </header>

        <div class="flex">
          <!-- Sidebar -->
          <aside class="w-64 bg-white min-h-[calc(100vh-4rem)] border-r border-gray-200">
            <nav class="p-4 space-y-1">
              <button data-view="pages" class="nav-item w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Pages
                </span>
              </button>
              <button data-view="navigation" class="nav-item w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  Navigation
                </span>
              </button>
              <button data-view="settings" class="nav-item w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Settings
                </span>
              </button>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="flex-1 p-8">
            <div id="content"></div>
          </main>
        </div>
      </div>
    `

    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view')
        this.switchView(view)

        // Update active state
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('bg-blue-50', 'text-blue-700'))
        e.currentTarget.classList.add('bg-blue-50', 'text-blue-700')
      })
    })

    // Sign out button
    document.getElementById('signOutBtn').addEventListener('click', async () => {
      await authHelpers.signOut()
    })

    // Show initial view
    this.switchView('pages')
    document.querySelector('[data-view="pages"]').classList.add('bg-blue-50', 'text-blue-700')
  }

  switchView(view) {
    this.currentView = view
    const content = document.getElementById('content')

    switch(view) {
      case 'pages':
        this.showPagesView(content)
        break
      case 'navigation':
        this.showNavigationView(content)
        break
      case 'settings':
        this.showSettingsView(content)
        break
    }
  }

  // ==================== PAGES VIEW ====================

  async showPagesView(content) {
    content.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Pages</h2>
          <button id="createPageBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Page
          </button>
        </div>
        <div id="pagesTable" class="bg-white rounded-lg shadow">
          <div class="p-8 text-center text-gray-500">Loading pages...</div>
        </div>
      </div>
    `

    // Load pages from Supabase
    const { data: pages, error } = await supabase
      .from('ic_web_pages')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      document.getElementById('pagesTable').innerHTML = `
        <div class="p-8 text-center text-red-600">Error loading pages: ${error.message}</div>
      `
      return
    }

    this.pages = pages || []

    if (!pages || pages.length === 0) {
      document.getElementById('pagesTable').innerHTML = `
        <div class="p-8 text-center text-gray-500">No pages yet. Create your first page!</div>
      `
    } else {
      this.renderPagesTable(pages)
    }

    // Setup create button
    document.getElementById('createPageBtn').addEventListener('click', () => this.showPageEditor())
  }

  renderPagesTable(pages) {
    const tableHTML = `
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${pages.map(page => `
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${page.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.slug}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    page.status === 'published' ? 'bg-green-100 text-green-800' :
                    page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }">
                    ${page.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(page.updated_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3 edit-page-btn" data-id="${page.id}">Edit</button>
                  <button class="text-red-600 hover:text-red-900 delete-page-btn" data-id="${page.id}">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `

    document.getElementById('pagesTable').innerHTML = tableHTML

    // Setup edit buttons
    document.querySelectorAll('.edit-page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pageId = e.currentTarget.getAttribute('data-id')
        const page = this.pages.find(p => p.id === pageId)
        this.showPageEditor(page)
      })
    })

    // Setup delete buttons
    document.querySelectorAll('.delete-page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pageId = e.currentTarget.getAttribute('data-id')
        this.deletePage(pageId)
      })
    })
  }

  showPageEditor(page = null) {
    const isNew = !page
    const headline = page?.content?.headline || ''
    const cta = page?.content?.call_to_action || ''

    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">${isNew ? 'Create New Page' : 'Edit Page'}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form id="pageForm" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
            <input type="text" name="title" value="${page?.title || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" name="slug" value="${page?.slug || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required ${page ? 'disabled' : ''}>
            <p class="text-xs text-gray-500 mt-1">URL-friendly identifier (cannot be changed after creation)</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input type="text" name="headline" value="${headline}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">${page?.description || ''}</textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Call to Action</label>
            <input type="text" name="cta" value="${cta}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="draft" ${page?.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="published" ${page?.status === 'published' ? 'selected' : ''}>Published</option>
              <option value="archived" ${page?.status === 'archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>

          <div class="flex gap-3 pt-6 border-t border-gray-200">
            <button type="button" class="close-modal flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">${isNew ? 'Create Page' : 'Update Page'}</button>
          </div>
        </form>
      </div>
    `

    document.getElementById('content').appendChild(modal)

    // Setup close buttons
    modal.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => modal.remove())
    })

    // Setup form submission
    modal.querySelector('#pageForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)

      const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        status: formData.get('status'),
        language: 'en',
        content: {
          headline: formData.get('headline'),
          call_to_action: formData.get('cta'),
          excerpt: formData.get('description')
        },
        updated_by: this.currentUser.email
      }

      if (isNew) {
        const { error } = await supabase
          .from('ic_web_pages')
          .insert([{ ...data, created_by: this.currentUser.email }])

        if (error) {
          alert('Error creating page: ' + error.message)
        } else {
          alert('Page created successfully!')
          modal.remove()
          this.showPagesView(document.getElementById('content'))
        }
      } else {
        const { error } = await supabase
          .from('ic_web_pages')
          .update(data)
          .eq('id', page.id)

        if (error) {
          alert('Error updating page: ' + error.message)
        } else {
          alert('Page updated successfully!')
          modal.remove()
          this.showPagesView(document.getElementById('content'))
        }
      }
    })
  }

  async deletePage(pageId) {
    if (!confirm('Are you sure you want to delete this page?')) {
      return
    }

    const { error } = await supabase
      .from('ic_web_pages')
      .delete()
      .eq('id', pageId)

    if (error) {
      alert('Error deleting page: ' + error.message)
    } else {
      alert('Page deleted successfully!')
      this.showPagesView(document.getElementById('content'))
    }
  }

  // ==================== NAVIGATION VIEW ====================

  async showNavigationView(content) {
    content.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Navigation</h2>
          <button id="addNavItemBtn" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Menu Item
          </button>
        </div>
        <div id="navTree" class="bg-white rounded-lg shadow">
          <div class="p-8 text-center text-gray-500">Loading navigation...</div>
        </div>
      </div>
    `

    const { data: navItems, error } = await supabase
      .from('ic_web_navigation')
      .select('*')
      .eq('menu_key', 'main')
      .eq('language', 'en')
      .order('order_position')

    if (error) {
      document.getElementById('navTree').innerHTML = `<div class="p-8 text-red-600">Error: ${error.message}</div>`
      return
    }

    this.navItems = navItems || []

    if (!navItems || navItems.length === 0) {
      document.getElementById('navTree').innerHTML = `<div class="p-8 text-center text-gray-500">No navigation items yet</div>`
    } else {
      this.renderNavTree(navItems)
    }

    document.getElementById('addNavItemBtn').addEventListener('click', () => this.showNavItemEditor())
  }

  renderNavTree(items) {
    const topLevel = items.filter(item => !item.parent_id)

    const html = `
      <div class="divide-y">
        ${topLevel.map(item => this.renderNavItem(item, items)).join('')}
      </div>
    `

    document.getElementById('navTree').innerHTML = html

    // Setup edit/delete buttons
    document.querySelectorAll('.edit-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.currentTarget.getAttribute('data-id')
        const item = this.navItems.find(i => i.id === itemId)
        this.showNavItemEditor(item)
      })
    })

    document.querySelectorAll('.delete-nav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const itemId = e.currentTarget.getAttribute('data-id')
        if (confirm('Delete this navigation item?')) {
          const { error } = await supabase
            .from('ic_web_navigation')
            .delete()
            .eq('id', itemId)

          if (!error) {
            this.showNavigationView(document.getElementById('content'))
          }
        }
      })
    })
  }

  renderNavItem(item, allItems, level = 0) {
    const children = allItems.filter(i => i.parent_id === item.id)

    return `
      <div style="padding-left: ${level * 24}px" class="py-3 px-6 ${level > 0 ? 'bg-gray-50' : 'bg-white'}">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-900">${item.label}</p>
            <p class="text-sm text-gray-500">${item.url}</p>
          </div>
          <div class="flex gap-2">
            <button class="edit-nav-btn text-blue-600 hover:text-blue-900 text-sm" data-id="${item.id}">Edit</button>
            <button class="delete-nav-btn text-red-600 hover:text-red-900 text-sm" data-id="${item.id}">Delete</button>
          </div>
        </div>
        ${children.length > 0 ? children.map(child => this.renderNavItem(child, allItems, level + 1)).join('') : ''}
      </div>
    `
  }

  showNavItemEditor(item = null) {
    const isNew = !item
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">${isNew ? 'Add Menu Item' : 'Edit Menu Item'}</h2>
          <button class="close-modal text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form id="navForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Label *</label>
            <input type="text" name="label" value="${item?.label || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL *</label>
            <input type="text" name="url" value="${item?.url || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parent Item</label>
            <select name="parent_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">None (Top Level)</option>
              ${this.navItems.filter(i => i.id !== item?.id).map(i =>
                `<option value="${i.id}" ${item?.parent_id === i.id ? 'selected' : ''}>${i.label}</option>`
              ).join('')}
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" class="close-modal flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">${isNew ? 'Add' : 'Update'}</button>
          </div>
        </form>
      </div>
    `

    document.getElementById('content').appendChild(modal)

    modal.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => modal.remove())
    })

    modal.querySelector('#navForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)

      const data = {
        label: formData.get('label'),
        url: formData.get('url'),
        parent_id: formData.get('parent_id') || null,
        menu_key: 'main',
        language: 'en',
        is_active: true,
        order_position: 0
      }

      if (isNew) {
        const { error } = await supabase
          .from('ic_web_navigation')
          .insert([data])

        if (error) {
          alert('Error: ' + error.message)
        } else {
          modal.remove()
          this.showNavigationView(document.getElementById('content'))
        }
      } else {
        const { error } = await supabase
          .from('ic_web_navigation')
          .update(data)
          .eq('id', item.id)

        if (error) {
          alert('Error: ' + error.message)
        } else {
          modal.remove()
          this.showNavigationView(document.getElementById('content'))
        }
      }
    })
  }

  // ==================== SETTINGS VIEW ====================

  async showSettingsView(content) {
    content.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Site Settings</h2>
        <div id="settingsForm" class="bg-white rounded-lg shadow">
          <div class="p-8 text-center text-gray-500">Loading settings...</div>
        </div>
      </div>
    `

    const { data: settings, error } = await supabase
      .from('ic_web_site_settings')
      .select('*')

    if (error) {
      document.getElementById('settingsForm').innerHTML = `<div class="p-8 text-red-600">Error: ${error.message}</div>`
      return
    }

    this.settings = {}
    settings?.forEach(s => {
      this.settings[s.key] = s
    })

    this.renderSettingsForm()
  }

  renderSettingsForm() {
    const html = `
      <form id="settingsUpdateForm" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
          <input type="text" name="site_name" value="${this.settings.site_name?.value?.en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
          <input type="text" name="site_tagline" value="${this.settings.site_tagline?.value?.en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input type="email" name="contact_email" value="${this.settings.contact_email?.value || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Save Settings</button>
        </div>
      </form>
    `

    document.getElementById('settingsForm').innerHTML = html

    document.getElementById('settingsUpdateForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)

      const updates = [
        { key: 'site_name', value: { en: formData.get('site_name') } },
        { key: 'site_tagline', value: { en: formData.get('site_tagline') } },
        { key: 'contact_email', value: formData.get('contact_email') }
      ]

      for (const update of updates) {
        const setting = this.settings[update.key]
        if (setting) {
          await supabase
            .from('ic_web_site_settings')
            .update({ value: update.value })
            .eq('id', setting.id)
        }
      }

      alert('Settings saved!')
    })
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminApp()
})
