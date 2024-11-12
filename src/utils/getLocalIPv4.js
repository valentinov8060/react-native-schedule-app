import Zeroconf from 'react-native-zeroconf'

const findLocalIPv4 = async () => {
  try {
    const zeroconf = new Zeroconf();

    return await new Promise((resolve, reject) => {
      // Mulai pemindaian selama 10 detik
      zeroconf.scan(type = 'http', protocol = 'tcp', domain = 'local.')
      const timeout = setTimeout(() => {
        zeroconf.stop();
        reject(new Error('Timeout: Could not find service "schedule-app".'));
      }, 10000);

      // Ketika ditemukan
      zeroconf.on('resolved', (service) => {
        if (service.name === 'schedule-app') {
          clearTimeout(timeout);
          zeroconf.stop();

          // Cari alamat IPv4
          const localIPv4 = service.addresses.find((address) =>
            /^\d+\.\d+\.\d+\.\d+$/.test(address)
          );

          if (localIPv4) {
            resolve(localIPv4);
          } else {
            reject(new Error('No IPv4 address found for service "schedule-app".'));
          }
        }
      });

      // Ketika tidak ditemukan
      zeroconf.on('error', (err) => {
        clearTimeout(timeout);
        zeroconf.stop();
        reject(new Error(`Zeroconf error: ${err.message || err}`));
      });

      // Ketika selesai
      zeroconf.on('stop', () => {
        clearTimeout(timeout);
      });
    });

  } catch (error) {
    throw new Error(`Failed to find local IPv4: ${error.message || error}`);
  }
};


export {
  findLocalIPv4
}