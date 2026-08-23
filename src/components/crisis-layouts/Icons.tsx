import React from "react";

export function EthereumIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#627EEA" />
      <path d="M127.962 0L0 212.32L127.962 287.958V157.34V0Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 312.187L126.386 314.106V413.447L127.961 416.892L256 236.585L127.961 312.187Z" fill="#627EEA" />
      <path d="M127.962 416.892V312.187L0 236.585L127.962 416.892Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 287.958L255.923 212.32L127.961 157.339V287.958Z" fill="#627EEA" fillOpacity="0.6" />
      <path d="M0 212.32L127.962 287.958V157.339L0 212.32Z" fill="#627EEA" fillOpacity="0.4" />
    </svg>
  );
}

export function PolygonIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5 0L38 10.7V32L19.5 21.3L1 32V10.7L19.5 0ZM29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
    </svg>
  );
}
