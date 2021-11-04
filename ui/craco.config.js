const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@screens': path.resolve(__dirname, 'src/screens/'),
      '@contexts': path.resolve(__dirname, 'src/contexts/'),
      '@api': path.resolve(__dirname, 'src/utils/api')
    }
  }
}