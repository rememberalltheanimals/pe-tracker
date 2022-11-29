CREATE TABLE counts (
 id SERIAL PRIMARY KEY,
 praise_counts INT NOT NULL,
 criticize_counts INT NOT NULL
);

INSERT INTO counts (praise_counts, criticize_counts) VALUES (0, 0);

UPDATE counts SET praise_counts = praise_counts +1;
