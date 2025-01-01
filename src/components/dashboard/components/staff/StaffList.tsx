import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Mail, UserCircle, Trash2 } from 'lucide-react';
import { StaffMember } from '../../../../types/staff';
import { Badge } from '../../../ui/Badge';
import { Button } from '../../../ui/Button';

interface StaffListProps {
  staff: StaffMember[];
  isLoading: boolean;
  onEdit: (member: StaffMember) => void;
  onDelete: (member: StaffMember) => void;
}

export function StaffList({ staff, isLoading, onEdit, onDelete }: StaffListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {staff.map((member) => (
          <motion.div
            key={member.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <UserCircle className="w-10 h-10 text-gray-400" />
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-1" />
                    {member.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={member.role === 'admin' ? 'success' : 'default'}>
                  {member.role === 'admin' ? 'Admin' : 'Staff'}
                </Badge>
                <Badge variant={member.active ? 'success' : 'warning'}>
                  {member.active ? 'Actif' : 'Inactif'}
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(member)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(member)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}