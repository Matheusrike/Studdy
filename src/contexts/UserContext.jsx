'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState(() => {
        // Tenta pegar a role do cookie, se não existir usa 'aluno' como padrão
        // return Cookies.get('userRole') || 'aluno';
        return 'admin';
    });

    // Quando a role mudar, atualiza o cookie
    useEffect(() => {
        // Cookies.set('userRole', userRole, { expires: 7 }); // Cookie expira em 7 dias
    }, [userRole]);

    return (
        <UserContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}   