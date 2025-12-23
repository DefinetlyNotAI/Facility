'use client';

/**
 * Test page for Terminal VN Engine
 */

import {TerminalVN} from '@/components/V&X/terminalVN';

export default function TerminalVNTestPage() {
    const testScript = `# title: Quick Test
# author: Terminal VN Engine
# version: 1.0

@node start
> System: Terminal VN Engine Test
> This is a simple test to verify everything works.
$ set testVar = "Hello World"
> Variable test: {testVar}
? What would you like to do?
- Continue -> next
- End test -> end

@node next
> System: Great! Everything is working correctly.
> The engine is ready to use.
@jump end

@node end
> System: Test complete!
`;

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            padding: '20px',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{width: '100%', maxWidth: '800px', height: '600px'}}>
                <TerminalVN
                    script={testScript}
                    onComplete={() => console.log('Test complete!')}
                    onVariableChange={(vars) => console.log('Variables:', vars)}
                    typingSpeed={20}
                />
            </div>
        </div>
    );
}

