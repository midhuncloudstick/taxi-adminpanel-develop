import { useState, useEffect } from 'react';

// Hook to load external scripts dynamically
export function useScript(src: string): 'idle' | 'loading' | 'ready' | 'error' {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    src ? 'loading' : 'idle'
  );

  useEffect(() => {
    // If the source is empty or null, we shouldn't attempt to load it
    if (!src) {
      setStatus('idle');
      return;
    }

    // Check if a script with this src already exists
    let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

    if (!script) {
      // Create script element and add to document head
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.head.appendChild(script);

      // Store status in attribute on script
      // This can be read by other instances of this hook
      const setAttributeFromEvent = (event: Event) => {
        script.setAttribute(
          'data-status',
          event.type === 'load' ? 'ready' : 'error'
        );
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      // Grab existing script status from attribute and set to state
      const currentStatus = script.getAttribute('data-status');
      if (currentStatus === 'ready' || currentStatus === 'error') {
        setStatus(currentStatus);
      }
    }

    // Event handler to update status in state
    // Note: Even if the script already exists we still need to add
    // event handlers to update the state for *this* hook instance
    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load' ? 'ready' : 'error');
    };

    // Add event listeners
    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    // Remove event listeners on cleanup
    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src]); // Only re-run effect if script src changes

  return status;
}
