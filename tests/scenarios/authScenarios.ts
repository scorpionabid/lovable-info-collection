// tests/scenarios/authScenarios.ts
export const authScenarios = {
  // Rol əsaslı giriş testləri
  loginScenarios: [
    {
      role: 'SuperAdmin',
      email: 'superadmin@edu.az',
      expectedAccess: [
        'users-page',
        'regions-page', 
        'sectors-page',
        'schools-page',
        'categories-page'
      ]
    },
    {
      role: 'RegionAdmin',
      email: 'region@infoline.az',
      expectedAccess: [
        'region-dashboard',
        'sectors-page',
        'schools-page'
      ],
      restrictedPages: [
        'users-management',
        'system-config'
      ]
    },
    {
      role: 'SectorAdmin',
      email: 'sector@infoline.az',
      expectedAccess: [
        'sector-dashboard',
        'schools-page'
      ],
      restrictedPages: [
        'region-management',
        'user-creation'
      ]
    },
    {
      role: 'SchoolAdmin',
      email: 'school@infoline.az',
      expectedAccess: [
        'school-dashboard',
        'data-entry-page'
      ],
      restrictedPages: [
        'admin-settings',
        'user-management'
      ]
    }
  ],

  // Səhifə giriş məhdudiyyətləri
  accessControlScenarios: [
    {
      role: 'RegionAdmin',
      tryToAccessPage: 'system-config',
      expectedResult: 'access-denied'
    },
    {
      role: 'SectorAdmin',
      tryToAccessPage: 'region-management',
      expectedResult: 'access-denied'
    }
  ],

  // Autentifikasiya xəta ssenariləri
  invalidLoginScenarios: [
    {
      email: 'invalid@email.com',
      password: 'wrongpassword',
      expectedError: 'authentication-failed'
    },
    {
      email: 'blocked-user@edu.az',
      password: 'validpassword',
      expectedError: 'user-blocked'
    }
  ]
};