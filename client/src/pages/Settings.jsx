import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ProfileSettings } from "../components/settings/profile-settings"
import { WorkspaceSettings } from "../components/settings/workspace-settings"
import { NotificationSettings } from "../components/settings/notification-settings"
import  ConsentSettings  from "../components/settings/ConsentSettings";
import { useSidebar } from "../context/sidebar-context"

function Settings() {
  const { isHidden } = useSidebar()
  
  return (
    <div className={`space-y-6 electric-dashboard transition-all duration-700 ${
      isHidden 
        ? 'ml-0 p-4' 
        : 'ml-80 p-4'
    }`}>
      {/* Electric Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="electric-particles opacity-20"></div>
        <div className="electric-particles-small opacity-15"></div>
      </div>

      <div className="electric-header p-6 rounded-2xl relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-10 rounded-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-text">Settings</h1>
          <p className="text-muted-foreground">Manage your account and workspace settings</p>
        </div>
      </div>

      <Card className="electric-card relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-primary/90">Settings</CardTitle>
          <CardDescription>Manage your preferences and account settings</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="consent">Consent</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="workspace">
              <WorkspaceSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="consent">
              <ConsentSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
