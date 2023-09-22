'use client';
import { useState,} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

export default function Client({isOpen, alert}: {isOpen: boolean, alert: string}) {
  const [openDialog, setOpenDialog] = useState(isOpen);
  
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renewing Friendship!</DialogTitle>
          <DialogDescription>{alert}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
