@@ .. @@
   // Keyboard shortcuts
   useKeyboardShortcut({
     key: 'Enter',
-    ctrlKey: true,
+    metaOrCtrlKey: true,
     handler: () => {
       if (isOpen && title) handleSubmit(new Event('submit') as any);
     }
@@ .. @@