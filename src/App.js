import React, { useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

const fakeApi = {
  async fetchItems(offset, limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = Array.from({ length: limit }, (_, index) => ({
          id: offset + index,
          content: `Item ${offset + index}`
        }));
        resolve(items);
      }, 1000);
    });
  }
};

const Table = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(auto, max-content)"
    }}
  >
    {children}
  </div>
);

const Row = ({ data, index, style }) => {
  const item = data[index];

  return (
    <div style={{ display: "contents" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          height: style.height - 1
        }}
      >
        <div>{item ? item.content : "Loading..."}</div>
      </div>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          height: style.height - 1
        }}
      >
        <div>{item ? item.content : "Loading..."}</div>
      </div>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          height: style.height - 1
        }}
      >
        <div>{item ? item.content : "Loading..."}</div>
      </div>
    </div>
  );
};

const InfiniteLoadingTable = () => {
  const [items, setItems] = useState([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const itemCount = hasMoreItems ? items.length + 1 : items.length;
  const loadMoreItems = useCallback(async () => {
    if (!hasMoreItems) return;

    const newItems = await fakeApi.fetchItems(items.length, 10);

    if (newItems.length === 0) {
      setHasMoreItems(false);
    } else {
      setItems((prevItems) => [...prevItems, ...newItems]);
    }
  }, [hasMoreItems, items.length]);

  const isItemLoaded = (index) => !hasMoreItems || index < items.length;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={height}
              itemCount={itemCount}
              itemData={items}
              itemSize={50}
              innerElementType={Table}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={width}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

export default function App() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <InfiniteLoadingTable />
    </div>
  );
}
