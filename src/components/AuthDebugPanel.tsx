import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export function AuthDebugPanel() {
  const [authState, setAuthState] = useState({
    firebaseToken: '',
    jwtToken: '',
    user: '',
    firebaseUser: null as FirebaseUser | null,
  });

  const checkAuthState = async () => {
    const firebaseToken = localStorage.getItem('firebase_id_token') || '';
    const jwtToken = localStorage.getItem('token') || '';
    const user = localStorage.getItem('user') || '';
    const firebaseUser = auth.currentUser;

    // Get fresh Firebase token if user is signed in
    let freshToken = '';
    if (firebaseUser) {
      try {
        freshToken = await firebaseUser.getIdToken(true);
        localStorage.setItem('firebase_id_token', freshToken);
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }

    setAuthState({
      firebaseToken: freshToken || firebaseToken,
      jwtToken,
      user,
      firebaseUser,
    });
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const refreshToken = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken(true);
        localStorage.setItem('firebase_id_token', token);
        alert('Token refreshed! Check console for details.');
        console.log('New token:', token.substring(0, 50) + '...');
        checkAuthState();
      } catch (error) {
        console.error('Error refreshing token:', error);
        alert('Error refreshing token: ' + error);
      }
    } else {
      alert('No Firebase user signed in');
    }
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg">🔍 Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Firebase Token:</span>
            <Badge variant={authState.firebaseToken ? 'default' : 'destructive'}>
              {authState.firebaseToken ? 'Present' : 'Missing'}
            </Badge>
          </div>
          {authState.firebaseToken && (
            <div className="text-xs font-mono bg-white p-2 rounded border">
              {authState.firebaseToken.substring(0, 50)}...
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">JWT Token:</span>
            <Badge variant={authState.jwtToken ? 'default' : 'secondary'}>
              {authState.jwtToken ? 'Present' : 'None'}
            </Badge>
          </div>
          {authState.jwtToken && (
            <div className="text-xs font-mono bg-white p-2 rounded border">
              {authState.jwtToken.substring(0, 50)}...
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Firebase User:</span>
            <Badge variant={authState.firebaseUser ? 'default' : 'destructive'}>
              {authState.firebaseUser ? 'Signed In' : 'Not Signed In'}
            </Badge>
          </div>
          {authState.firebaseUser && (
            <div className="text-xs bg-white p-2 rounded border">
              <div><strong>Email:</strong> {authState.firebaseUser.email}</div>
              <div><strong>UID:</strong> {authState.firebaseUser.uid}</div>
              <div><strong>Email Verified:</strong> {authState.firebaseUser.emailVerified ? 'Yes' : 'No'}</div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">User Data:</span>
            <Badge variant={authState.user ? 'default' : 'secondary'}>
              {authState.user ? 'Present' : 'None'}
            </Badge>
          </div>
          {authState.user && (
            <div className="text-xs font-mono bg-white p-2 rounded border max-h-32 overflow-auto">
              {authState.user}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={checkAuthState} variant="outline" size="sm">
            🔄 Refresh State
          </Button>
          <Button onClick={refreshToken} variant="outline" size="sm">
            🔑 Refresh Firebase Token
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div><strong>Recommendation:</strong></div>
          {!authState.firebaseUser && !authState.jwtToken && (
            <div className="text-red-600">⚠️ You need to sign in first!</div>
          )}
          {authState.firebaseUser && !authState.firebaseToken && (
            <div className="text-orange-600">⚠️ Firebase user signed in but no token. Click "Refresh Firebase Token"</div>
          )}
          {(authState.firebaseToken || authState.jwtToken) && (
            <div className="text-green-600">✅ You have a valid auth token and can submit the form!</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
