/**
 * app.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */
/* eslint no-process-env: 0 */

// import Auth                 from './auth';
import AppSingleton         from './appsingleton';
import Middlewares          from '../middlewares';

async function start() {
    const sharedInstance = AppSingleton.getInstance();

    // sharedInstance.server.post('/weather/bot', auth, Middlewares.bot);
    sharedInstance.server.get('/status', Middlewares.status);

    sharedInstance.server.get('/start', Middlewares.start);

    sharedInstance.server.get('/stop', Middlewares.stop);
    
    sharedInstance.clients = -1;

    sharedInstance.io.on('connection', (socket) => { 
        console.log('Client Connected!');
        sharedInstance.clients++;
        socket.broadcast.emit('update_client_count', sharedInstance.clients);
        socket.on('voice_captions', (voiceCaptions) => {
            socket.broadcast.emit('app_captions', voiceCaptions);
            console.log(voiceCaptions);
        });
        socket.on('disconnect', () => {
            sharedInstance.clients--;
            socket.broadcast.emit('update_client_count', sharedInstance.clients);
        });
    });

    

    // Start server
    sharedInstance.httpServer.listen(process.env.PORT || 8080);
    sharedInstance.log.info({ message: `Application started on ${sharedInstance.startTime}` });
}

export default { start };
