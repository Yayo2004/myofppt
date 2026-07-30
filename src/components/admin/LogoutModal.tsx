"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl p-6 shadow-2xl text-center"
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Déconnexion</h3>
            <p className="mt-1 text-sm text-gray-500">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Se déconnecter
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
