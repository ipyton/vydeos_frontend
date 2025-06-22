import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document } from 'flexsearch';
import { get, set } from 'idb-keyval';

// IndexedDB keys for persistence
const CONTACTS_INDEX_KEY = 'flexsearch-contacts-index';
const MESSAGES_INDEX_KEY = 'flexsearch-messages-index';

// Create React context for search
const SearchContext = createContext({
  addContact: async () => {},
  removeContact: async () => {},
  updateContact: async () => {},
  searchContacts: async () => [],
  addMessage: async () => {},
  removeMessage: async () => {},
  updateMessage: async () => {},
  searchMessages: async () => [],
  ready: false
});

export function SearchProvider({ children }) {
  const [contactsIdx, setContactsIdx] = useState(null);
  const [messagesIdx, setMessagesIdx] = useState(null);
  const [ready, setReady] = useState(false);

  // Initialize or load indexes
  useEffect(() => {
    async function initIndexes() {
      // Initialize contacts index
      const contactsIndex = new Document({
        document: {
          id: 'id',
          index: ['name', 'username', 'email', 'groupName', 'lastMessage']
        }
      });

      // Initialize messages index
      const messagesIndex = new Document({
        document: {
          id: 'id',
          index: ['content', 'senderName', 'type']
        }
      });

      try {
        // Load contacts index
        const storedContacts = await get(CONTACTS_INDEX_KEY);
        if (storedContacts) {
          await contactsIndex.import(storedContacts);
          console.log('FlexSearch contacts index loaded from IndexedDB');
        } else {
          console.log('New FlexSearch contacts index created');
        }

        // Load messages index
        const storedMessages = await get(MESSAGES_INDEX_KEY);
        if (storedMessages) {
          await messagesIndex.import(storedMessages);
          console.log('FlexSearch messages index loaded from IndexedDB');
        } else {
          console.log('New FlexSearch messages index created');
        }
      } catch (error) {
        console.error('Failed to load indexes:', error);
      }

      setContactsIdx(contactsIndex);
      setMessagesIdx(messagesIndex);
      setReady(true);
    }

    initIndexes();
  }, []);

  // Persist contacts index to IndexedDB
  async function persistContacts(index) {
    try {
      const exported = await index.export();
      await set(CONTACTS_INDEX_KEY, exported);
      console.log('Contacts index persisted to IndexedDB');
    } catch (error) {
      console.error('Failed to persist contacts index:', error);
    }
  }

  // Persist messages index to IndexedDB
  async function persistMessages(index) {
    try {
      const exported = await index.export();
      await set(MESSAGES_INDEX_KEY, exported);
      console.log('Messages index persisted to IndexedDB');
    } catch (error) {
      console.error('Failed to persist messages index:', error);
    }
  }

  // Contact operations
  async function addContact(contact) {
    if (!contactsIdx) return;
    
    // Create searchable document
    const doc = {
      id: `${contact.type}_${contact.userId}_${contact.groupId || ''}`,
      name: contact.name || '',
      username: contact.username || '',
      email: contact.email || '',
      groupName: contact.groupName || '',
      lastMessage: contact.lastMessage || '',
      type: contact.type,
      userId: contact.userId,
      groupId: contact.groupId
    };
    
    contactsIdx.add(doc);
    await persistContacts(contactsIdx);
  }

  async function removeContact(contactId) {
    if (!contactsIdx) return;
    contactsIdx.remove({ id: contactId });
    await persistContacts(contactsIdx);
  }

  async function updateContact(contact) {
    if (!contactsIdx) return;
    
    const doc = {
      id: `${contact.type}_${contact.userId}_${contact.groupId || ''}`,
      name: contact.name || '',
      username: contact.username || '',
      email: contact.email || '',
      groupName: contact.groupName || '',
      lastMessage: contact.lastMessage || '',
      type: contact.type,
      userId: contact.userId,
      groupId: contact.groupId
    };
    
    contactsIdx.update(doc);
    await persistContacts(contactsIdx);
  }

  async function searchContacts(query, limit = 10) {
    if (!contactsIdx || !query.trim()) return [];
    
    try {
      const results = await contactsIdx.search(query, { 
        enrich: true,
        limit
      });
      
      // Extract documents from results
      const contacts = [];
      results.forEach(result => {
        result.result.forEach(item => {
          contacts.push(item.doc);
        });
      });
      
      return contacts;
    } catch (error) {
      console.error('Contact search error:', error);
      return [];
    }
  }

  // Message operations
  async function addMessage(message) {
    if (!messagesIdx) return;
    
    const doc = {
      id: `${message.id || Date.now()}_${message.userId}_${message.groupId || ''}`,
      content: message.content || message.text || '',
      senderName: message.senderName || message.username || '',
      type: message.type || 'message',
      userId: message.userId,
      groupId: message.groupId,
      timestamp: message.timestamp || Date.now()
    };
    
    messagesIdx.add(doc);
    await persistMessages(messagesIdx);
  }

  async function removeMessage(messageId) {
    if (!messagesIdx) return;
    messagesIdx.remove({ id: messageId });
    await persistMessages(messagesIdx);
  }

  async function updateMessage(message) {
    if (!messagesIdx) return;
    
    const doc = {
      id: `${message.id}_${message.userId}_${message.groupId || ''}`,
      content: message.content || message.text || '',
      senderName: message.senderName || message.username || '',
      type: message.type || 'message',
      userId: message.userId,
      groupId: message.groupId,
      timestamp: message.timestamp || Date.now()
    };
    
    messagesIdx.update(doc);
    await persistMessages(messagesIdx);
  }

  async function searchMessages(query, limit = 20) {
    if (!messagesIdx || !query.trim()) return [];
    
    try {
      const results = await messagesIdx.search(query, { 
        enrich: true,
        limit
      });
      
      // Extract documents from results
      const messages = [];
      results.forEach(result => {
        result.result.forEach(item => {
          messages.push(item.doc);
        });
      });
      
      // Sort by timestamp descending
      return messages.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.error('Message search error:', error);
      return [];
    }
  }

  // Bulk operations for initial data loading
  async function bulkAddContacts(contacts) {
    if (!contactsIdx) return;
    
    for (const contact of contacts) {
      const doc = {
        id: `${contact.type}_${contact.userId}_${contact.groupId || ''}`,
        name: contact.name || '',
        username: contact.username || '',
        email: contact.email || '',
        groupName: contact.groupName || '',
        lastMessage: contact.lastMessage || '',
        type: contact.type,
        userId: contact.userId,
        groupId: contact.groupId
      };
      
      contactsIdx.add(doc);
    }
    
    await persistContacts(contactsIdx);
  }

  const value = {
    // Contact operations
    addContact,
    removeContact,
    updateContact,
    searchContacts,
    bulkAddContacts,
    
    // Message operations
    addMessage,
    removeMessage,
    updateMessage,
    searchMessages,
    
    // State
    ready
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}