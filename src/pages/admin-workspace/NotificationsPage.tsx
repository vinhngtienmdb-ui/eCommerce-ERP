import React, { useState } from 'react';
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!title || !message) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setMessage('');
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Notifications</h1>
      <div className="space-y-4 max-w-lg">
        <Input
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendNotification} disabled={loading}>
          {loading ? 'Sending...' : 'Send to All Users'}
        </Button>
      </div>
    </div>
  );
}
