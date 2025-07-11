<AdvancedMarker
            key={marker.id}
            position={marker}
            content={
              <div
                onMouseEnter={() => setHoveredItemId(marker.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <MarkerIcon type={marker.type} isHovered={hoveredItemId === marker.id} />
              </div>
            }
          />