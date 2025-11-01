import React from 'react'
import HeaderDisplay from './HeaderDisplay'

function Container({ children }) {
  return (
    <div style={{
      maxWidth: '1200px',    // içerik genişliği
      margin: '0 auto',      // ortalama
      padding: '0 20px',     // sağ-sol boşluk
    }}>
      {/* <HeaderDisplay /> */}
      <main style={{ marginTop: '80px' }}> {/* header yüksekliğini boş bırak */}
        {children}
      </main>
    </div>
  )
}

export default Container
