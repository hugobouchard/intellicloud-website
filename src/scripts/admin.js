import { supabase, authHelpers, db } from '../lib/supabaseClient.js'

class AdminApp {
  constructor() {
    this.currentUser = null
    this.currentView = 'pages'
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
              <button data-view="seo" class="nav-item w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  SEO Meta
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
              <button data-view="media" class="nav-item w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                <span class="flex items-center gap-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Media
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
      case 'seo':
        this.showSEOView(content)
        break
      case 'navigation':
        this.showNavigationView(content)
        break
      case 'settings':
        this.showSettingsView(content)
        break
      case 'media':
        this.showMediaView(content)
        break
    }
  }

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

    if (!pages || pages.length === 0) {
      document.getElementById('pagesTable').innerHTML = `
        <div class="p-8 text-center text-gray-500">No pages yet. Create your first page!</div>
      `
      return
    }

    const tableHTML = `
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${page.language.toUpperCase()}</td>
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
                  <button class="text-blue-600 hover:text-blue-900 mr-3" onclick="window.editPage('${page.id}')">Edit</button>
                  <button class="text-red-600 hover:text-red-900" onclick="window.deletePage('${page.id}')">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `

    document.getElementById('pagesTable').innerHTML = tableHTML
  }

  showSEOView(content) {
    content.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">SEO Meta Management</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">SEO meta management interface will be displayed here.</p>
          <p class="text-sm text-gray-500 mt-2">You can manage meta titles, descriptions, Open Graph tags, and more.</p>
        </div>
      </div>
    `
  }

  showNavigationView(content) {
    content.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Navigation Management</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Navigation menu management interface will be displayed here.</p>
          <p class="text-sm text-gray-500 mt-2">Manage your site's navigation menus for both English and French.</p>
        </div>
      </div>
    `
  }

  showSettingsView(content) {
    content.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Site Settings</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Site settings management interface will be displayed here.</p>
          <p class="text-sm text-gray-500 mt-2">Configure global site settings like name, tagline, contact info, etc.</p>
        </div>
      </div>
    `
  }

  showMediaView(content) {
    content.innerHTML = `
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Media Library</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Media library interface will be displayed here.</p>
          <p class="text-sm text-gray-500 mt-2">Upload and manage images and other media assets.</p>
        </div>
      </div>
    `
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminApp()
})
