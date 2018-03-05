import net = require('net');
import detect = require('async/detect');

/**
 * Function that detects the first port not in use in a given range
 * e.g.
 *   findFirstFreePort('127.0.0.1', 8000, 8030, (port) => {
 *       console.log(port)
 *   });
 *
 */
export function findFirstFreePort(host: string, start: number, end: number): Promise<number> {
    const ports: number[] = [];
    for (let i = start; i < end; i++) {
        ports.push(i);
    }

    const probe = (port: number, cb: Function) => {
        let calledOnce = false;

        const server = net.createServer().listen(port, host);
        const timeoutRef = setTimeout(() => {
            calledOnce = true;
            cb(port, false);
        }, 2000);

        // Active timeout won't require node event loop to remain active
        timeoutRef.unref();

        server.on('listening', () => {
            clearTimeout(timeoutRef);
            if (server) server.close();
            if (!calledOnce) {
                calledOnce = true;
                cb(port, true);
            }
        });

        server.on('error', (err: any) => {
            clearTimeout(timeoutRef);
            let result = true;
            if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
                result = false;
            }
            if (!calledOnce) {
                calledOnce = true;
                cb(port, result);
            }
        });
    };

    return new Promise(resolve => {
        detect(ports, probe, (port: number) => {
            resolve(port);
        });
    });
}
